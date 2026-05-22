/**
 * functions/muxIngest.js
 * ─────────────────────────────────────────────────────────────────────
 * Firebase Cloud Function that:
 *  1. Triggers when a new 'projects' doc has status === 'processing'
 *  2. Sends the Firebase Storage video URL to Mux for ingestion
 *  3. Polls Mux until encoding is done
 *  4. Updates the Firestore doc with muxPlaybackId + status: 'ready'
 *
 * DEPLOY:
 *   firebase init functions   (choose JavaScript)
 *   cd functions
 *   npm install @mux/mux-node firebase-admin firebase-functions
 *   firebase deploy --only functions
 *
 * ENV (set via Firebase CLI):
 *   firebase functions:config:set mux.token_id="..." mux.token_secret="..."
 */

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const Mux       = require('@mux/mux-node');

admin.initializeApp();
const db = admin.firestore();

const { Video } = new Mux(
  functions.config().mux.token_id,
  functions.config().mux.token_secret
);

/* ── Trigger: new Firestore doc in 'projects' ────────────────── */
exports.ingestVideoToMux = functions
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Only process videos waiting to be ingested
    if (data.type !== 'video' || data.status !== 'processing') return null;

    const projectId = context.params.projectId;
    const docRef    = db.collection('projects').doc(projectId);

    try {
      // 1. Tell Mux to pull the video from Firebase Storage
      const asset = await Video.Assets.create({
        input           : data.url,            // Firebase Storage public URL
        playback_policy : ['public'],
        mp4_support     : 'standard',          // allows MP4 download if needed
      });

      // 2. Poll until Mux finishes encoding (usually 1–5 min per GB)
      let ready = false;
      let attempts = 0;
      let playbackId = null;

      while (!ready && attempts < 60) {
        await new Promise(r => setTimeout(r, 10_000)); // wait 10s between polls
        const fetched = await Video.Assets.get(asset.id);

        if (fetched.status === 'ready') {
          ready      = true;
          playbackId = fetched.playback_ids?.[0]?.id;
        } else if (fetched.status === 'errored') {
          throw new Error(`Mux encoding failed for asset ${asset.id}`);
        }
        attempts++;
      }

      if (!playbackId) throw new Error('Mux encoding timed out');

      // 3. Update Firestore with Mux IDs
      await docRef.update({
        muxAssetId   : asset.id,
        muxPlaybackId: playbackId,
        status       : 'ready',
        updatedAt    : admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`Video ready: ${projectId} → Mux ${playbackId}`);
      return null;

    } catch (err) {
      functions.logger.error('muxIngest error:', err);
      await docRef.update({ status: 'error', errorMessage: err.message });
      return null;
    }
  });

/* ── Trigger: delete Mux asset when Firestore doc is deleted ─── */
exports.deleteMuxAsset = functions.firestore
  .document('projects/{projectId}')
  .onDelete(async (snap) => {
    const data = snap.data();
    if (data.muxAssetId) {
      try {
        await Video.Assets.del(data.muxAssetId);
        functions.logger.info(`Deleted Mux asset ${data.muxAssetId}`);
      } catch (err) {
        functions.logger.warn('Failed to delete Mux asset:', err.message);
      }
    }
    return null;
  });