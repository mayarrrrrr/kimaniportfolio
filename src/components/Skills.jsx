import { section } from "framer-motion/client";
import python from '../assets/pythonlogo.png'
import react from '../assets/reactjs.jpeg'
import aws from '../assets/aws.jpeg'
import writing from '../assets/writing.png'


const Skills = ({darkMode}) => {
    const skills=[
        {name: "Python",icon:python , level:85,color:'from-blue-500 to-indigo-500'},
        {name: "React JS",icon:react , level:75,color:'from-cyan-500 to-blue-500'},
        {name: "AWS",icon:aws , level:90,color:'from-orange-500 to-amber-500'},
        {name: "Article writing",icon:writing , level:90,color:'from-red-500 to-orange-500'},
        

    ];

  return (
   <section
  id="skills"
  style={{
    backgroundColor: darkMode ? "#111827" : "#f9fafb",
  }}
  className="py-20 relative overflow-hidden"
>
  <div className="container px-5 mx-auto">
    
    {/* Heading */}
    <div className="text-center mb-20" data-aos="fade-up">
      <h1
        className="sm:text-5xl text-4xl font-bold title-font mb-6"
        style={{
          color: darkMode ? "white" : "#1f2937",
        }}
      >
        My{" "}
        <span
          style={{
            background: "linear-gradient(to right,#f97316,#f59e0b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Skills
        </span>
      </h1>

      <p
        className="text-lg max-w-2xl mx-auto leading-relaxed"
        style={{
          color: darkMode ? "#d1d5db" : "#4b5563",
        }}
      >
        Technologies and tools I use to build scalable backend systems,
        cloud-ready solutions, and modern digital experiences.
      </p>
    </div>

    {/* Skills Grid */}
    <div
      className="flex flex-wrap -m-4"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      {skills.map((skill, index) => (
        <div
          key={index}
          className="p-4 lg:w-1/4 md:w-1/2 w-full"
          data-aos="fade-up"
          data-aos-delay={`${300 + index * 100}`}
        >
          <div
            style={{
              background: darkMode
                ? "linear-gradient(to bottom right, #1f2937, #111827)"
                : "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
              borderColor: darkMode ? "#374151" : "#e5e7eb",
            }}
            className="h-full rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/50 group overflow-hidden relative hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10"></div>

            {/* Card Content */}
            <div className="relative z-10">
              
              {/* Skill Header */}
              <div className="flex items-center mb-8">
                <div
                  style={{
                    background: darkMode
                      ? "linear-gradient(to bottom right, #374151, #1f2937)"
                      : "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)",
                  }}
                  className="w-16 h-16 rounded-2xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3
                  className="text-2xl font-bold ml-4"
                  style={{
                    color: darkMode ? "white" : "#1f2937",
                  }}
                >
                  {skill.name}
                </h3>
              </div>

              {/* Proficiency */}
              <div className="mb-3 flex justify-between items-center w-full">
                <span
                  className="font-medium"
                  style={{
                    color: darkMode ? "#d1d5db" : "#6b7280",
                  }}
                >
                  Proficiency
                </span>

                <span
                  className="font-bold text-lg"
                  style={{
                    background:
                      "linear-gradient(to right,#f97316,#f59e0b)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full rounded-full h-3 overflow-hidden"
                style={{
                  backgroundColor: darkMode ? "#374151" : "#e5e7eb",
                }}
              >
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${skill.level}%`,
                    minWidth: "12px",
                  }}
                ></div>
              </div>

              {/* Divider */}
              <div
                className={`mt-6 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              ></div>

              {/* Bottom Accent Line */}
              <div
                className="h-1 rounded-full opacity-70 group-hover:w-full transition-all duration-500 w-1/3 mt-4"
                style={{
                  background:
                    "linear-gradient(to right, #f97316,#f59e0b)",
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}

export default Skills;