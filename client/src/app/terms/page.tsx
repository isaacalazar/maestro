import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-gray-400 text-lg">Last updated: June 20, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Section 1 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                1
              </span>
              Acceptance of Terms
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  By accessing and using Maestro (&ldquo;the Service&rdquo;),
                  you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                2
              </span>
              Description of Service
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  Maestro is an internship application tracking platform that
                  helps students and job seekers organize, track, and manage
                  their internship applications. The service includes features
                  such as application status tracking, deadline reminders, and
                  progress analytics.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                3
              </span>
              User Accounts
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Account Creation
                </h3>
                <p>
                  To use certain features of the Service, you must create an
                  account. You agree to provide accurate, current, and complete
                  information during the registration process.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Account Security
                </h3>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                4
              </span>
              Acceptable Use
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">You agree not to use the Service to:</p>
              <div className="grid gap-4">
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Violate any applicable laws or regulations</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Infringe upon the rights of others</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Upload or transmit malicious code or harmful content
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Attempt to gain unauthorized access to our systems
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>
                    Use the service for any commercial purpose without our
                    consent
                  </span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Harass, abuse, or harm other users</span>
                </div>
                <div className="flex items-start space-x-3 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-3 flex-shrink-0"></div>
                  <span>Share false or misleading information</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                5
              </span>
              User Content
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Your Content
                </h3>
                <p>
                  You retain ownership of all content you submit to the Service,
                  including application data, notes, and other information. By
                  submitting content, you grant us a license to use, store, and
                  process your content solely for the purpose of providing the
                  Service.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Content Standards
                </h3>
                <p>
                  All content must comply with our community guidelines and
                  applicable laws. We reserve the right to remove content that
                  violates these terms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                6
              </span>
              Privacy
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  Your privacy is important to us. Please review our{" "}
                  <Link
                    href="/privacy"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Privacy Policy
                  </Link>
                  , which also governs your use of the Service, to understand
                  our practices regarding the collection and use of your
                  information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                7
              </span>
              Service Availability
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We strive to maintain high availability of our Service, but we
                  do not guarantee uninterrupted access. The Service may be
                  temporarily unavailable due to maintenance, updates, or
                  technical issues.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                8
              </span>
              Intellectual Property
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  The Service and its original content, features, and
                  functionality are owned by Maestro and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                9
              </span>
              Termination
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice, for conduct that we
                  believe violates these Terms of Service or is harmful to other
                  users, us, or third parties.
                </p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  You may terminate your account at any time by contacting us or
                  using the account deletion feature in your settings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                10
              </span>
              Disclaimers
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  The Service is provided &ldquo;as is&rdquo; and &ldquo;as
                  available&rdquo; without warranties of any kind. We disclaim
                  all warranties, express or implied, including but not limited
                  to implied warranties of merchantability, fitness for a
                  particular purpose, and non-infringement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                11
              </span>
              Limitation of Liability
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  In no event shall Maestro be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from your use
                  of the Service.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                12
              </span>
              Changes to Terms
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  We reserve the right to modify these terms at any time. We
                  will notify users of any material changes by posting the new
                  Terms of Service on this page and updating the &ldquo;Last
                  updated&rdquo; date. Your continued use of the Service after
                  such changes constitutes acceptance of the new terms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                13
              </span>
              Governing Law
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p>
                  These Terms shall be interpreted and governed by the laws of
                  the United States, without regard to its conflict of law
                  provisions. Any disputes arising from these terms will be
                  resolved in the courts of the United States.
                </p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section className="bg-gray-950 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center">
              <span className="bg-purple-400/10 text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                14
              </span>
              Contact Information
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
                <div className="space-y-2">
                  <p className="text-white font-medium">
                    Email:{" "}
                    <span className="text-purple-400">legal@maestro.com</span>
                  </p>
                  <p className="text-white font-medium">
                    Address:{" "}
                    <span className="text-gray-300">
                      123 Legal Street, Terms City, TC 12345
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
