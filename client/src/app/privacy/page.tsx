import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-all duration-200 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">Last updated: Jun 20, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                1
              </span>
              Information We Collect
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Personal Information
                </h3>
                <p>
                  When you create an account with Maestro, we collect
                  information such as your name, email address, and any other
                  information you provide during registration.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Application Data
                </h3>
                <p>
                  We collect and store information about your internship
                  applications, including company names, positions, application
                  dates, status updates, and any notes you add to track your
                  progress.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Usage Information
                </h3>
                <p>
                  We automatically collect information about how you use our
                  service, including your IP address, browser type, device
                  information, and usage patterns to improve our service.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                2
              </span>
              How We Use Your Information
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">We use the information we collect to:</p>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Provide and maintain our internship tracking service
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Send you important updates about your applications
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Improve our service and develop new features</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Provide customer support and respond to your inquiries
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Ensure the security and integrity of our platform</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                3
              </span>
              Information Sharing
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties. We may share your information only
                in the following circumstances:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>With your explicit consent</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>To comply with legal obligations or court orders</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    To protect our rights, property, or safety, or that of our
                    users
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    With service providers who assist us in operating our
                    platform (under strict confidentiality agreements)
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                4
              </span>
              Data Security
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                  This includes encryption of data in transit and at rest,
                  regular security audits, and access controls.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                5
              </span>
              Data Retention
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We retain your personal information for as long as necessary
                  to provide our services and fulfill the purposes outlined in
                  this privacy policy. You may request deletion of your account
                  and associated data at any time.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                6
              </span>
              Your Rights
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">You have the right to:</p>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Access and review your personal information</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Correct inaccurate or incomplete information</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Delete your account and associated data</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Export your data in a portable format</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Opt out of non-essential communications</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                7
              </span>
              Cookies and Tracking
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We use cookies and similar tracking technologies to enhance
                  your experience on our platform. These help us remember your
                  preferences, analyze usage patterns, and provide personalized
                  content. You can control cookie settings through your browser
                  preferences.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                8
              </span>
              Changes to This Policy
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We may update this privacy policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the &ldquo;Last updated&rdquo; date.
                  Your continued use of our service after such changes
                  constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                9
              </span>
              Contact Us
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
              </p>
              <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    Email:{" "}
                    <span className="text-purple-400">privacy@maestro.com</span>
                  </p>
                  <p className="text-white font-medium">
                    Address:{" "}
                    <span className="text-gray-300">
                      123 Privacy Street, Data City, DC 12345
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
