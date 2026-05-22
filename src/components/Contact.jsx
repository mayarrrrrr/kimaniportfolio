import { motion } from "framer-motion";

const ContactDetails = ({ darkMode }) => {
  const isDark = darkMode;

  const contacts = [
    {
      label: "Email",
      value: "kelvkim.mwangi@gmail.com",
      link: "mailto:kelvkim.mwangi@gmail.com",
    },
    {
      label: "Phone",
      value: "+254 746 871 931",
    //   link: "tel:+254 746 871 931",
    },
    {
      label: "LinkedIn",
      value: "Kelvin Kimani",
      link: "https://www.linkedin.com/in/kelvin-kimani-5b8623190/",
    },
  ];

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-6 py-28 overflow-hidden"
      style={{ background: isDark ? "#050505" : "#f3ede5" }}
    >
      {/* cinematic glow */}
      <div className="absolute w-[600px] h-[600px] bg-orange-500 blur-[140px] opacity-20 -top-40 -left-40 rounded-full" />
      <div className="absolute w-[500px] h-[500px] bg-blue-500 blur-[140px] opacity-20 bottom-0 right-0 rounded-full" />

      <div className="relative z-10 max-w-4xl w-full">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-orange-400">
            Contact
          </p>

          <h1
            className="text-5xl md:text-6xl font-black uppercase mt-4"
            style={{
              color: isDark ? "#fff" : "#111",
              fontFamily: "Georgia, serif",
            }}
          >
            Let’s Connect
            <span
              className="block"
              style={{
                WebkitTextStroke: isDark
                  ? "1.5px rgba(255,255,255,0.2)"
                  : "1.5px rgba(0,0,0,0.15)",
                color: "transparent",
              }}
            >
              Directly
            </span>
          </h1>

          <p className="text-sm opacity-60 mt-4">
            Reach out through any of the channels below for collaborations, film projects, or creative work.
          </p>
        </motion.div>

        {/* CONTACT CARDS */}
        <div className="grid gap-6">
          {contacts.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.link}
              target={item.label === "LinkedIn" ? "_blank" : "_self"}
              rel="noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02, x: 6 }}
              className="flex items-center justify-between p-6 rounded-2xl border backdrop-blur-xl transition-all"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.6)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              }}
            >
              {/* left side */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400">
                  {item.label}
                </p>

                <p
                  className="text-lg font-bold mt-1"
                  style={{ color: isDark ? "#fff" : "#111" }}
                >
                  {item.value}
                </p>
              </div>

              {/* arrow */}
              <div className="text-orange-400 text-xl">→</div>
            </motion.a>
          ))}
        </div>

        {/* FOOTER QUOTE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-20"
        > 
        <a
  href="https://www.linkedin.com/in/mayarakok"
  className="group"
>
  <p className="text-xs opacity-50 transition-colors duration-300 group-hover:text-cyan-400">
    App developed by @mayarakok
  </p>
</a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactDetails;