export function TestimonialSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Computer Science Student, Stanford",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "Maestro saved me so much time during my internship search. I was able to apply to twice as many positions because I wasn't constantly checking my email for updates.",
      bgColor: "bg-[#0f172a]", // dark blue
    },
    {
      name: "Priya Patel",
      role: "Engineering Student, MIT",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The automatic status updates are a game changer. I no longer have to manually track which companies have responded and which haven't.",
      bgColor: "bg-[#1e1b4b]", // indigo/purple
    },
    {
      name: "Marcus Williams",
      role: "Business Student, NYU",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "As someone who applied to over 50 internships, Maestro was essential for keeping everything organized. I wouldn't have landed my dream internship without it.",
      bgColor: "bg-[#292524]", // brown
    },
    {
      name: "Sophia Chen",
      role: "Data Science Student, UC Berkeley",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The email integration is seamless. It correctly identified interview invitations and rejections with impressive accuracy.",
      bgColor: "bg-[#0f172a]", // dark blue
    },
  ];

  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Trusted by the best in business
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          Hear from some of the students building their careers with Maestro.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${testimonial.bgColor} rounded-xl p-6 shadow-xl`}
            >
              <div className="mb-6">
                <p className="text-zinc-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
