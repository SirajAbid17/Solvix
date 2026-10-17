import React from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDatabase,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiGlobe,
  FiKey,
  FiLock,
  FiMail,
  FiRefreshCw,
  FiServer,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import PrivacySection, {
  BulletList,
  DataTerm,
  DataTermCompact,
  RightItem,
} from "./PrivacySection";
import { Link } from "react-router-dom";

const PrivacyContent = () => {
  return (
    <main className="relative w-full overflow-hidden">
      {}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-[#c9a468]/[0.025] blur-[140px]" />

      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-2 lg:px-10 lg:py-8">
        <div className="w-full">
          {}
          <div className="mb-2 border-b border-white/[0.08] pb-12 sm:mb-20">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a468]/60" />

              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c9a468]/70">
                Privacy Policy
              </span>
            </div>

            <h2 className="max-w-4xl font-serif text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
              How we handle your information.
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/45 sm:text-[15px]">
              We believe privacy should be understandable. This policy explains
              what information Solvix may collect, why we use it, how we protect
              it, and the choices available to you.
            </p>
          </div>

          {}
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {}
            <PrivacySection
              id="section-01"
              number="01"
              icon={FiDatabase}
              title="Information we collect"
            >
              <p>
                When you use Solvix AI, we may collect information necessary to
                create your account, operate our services, maintain security,
                and improve your experience.
              </p>

              <dl className="mt-8 w-full divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07] p-3">
                <DataTerm
                  icon={FiUserCheck}
                  term="Account data"
                  text="Name, email, profile information, authentication data, and preferences."
                />

                <DataTerm
                  icon={FiDatabase}
                  term="Usage data"
                  text="Interactions, feature usage, technical logs, and diagnostic information."
                />

                <DataTerm
                  icon={FiCpu}
                  term="AI content"
                  text="Prompts, conversations, documents, code, images, and other content you provide."
                />

                <DataTerm
                  icon={FiServer}
                  term="Technical data"
                  text="Browser, device, network, and security-related information."
                />
              </dl>
            </PrivacySection>

            {}
            <PrivacySection
              id="section-02"
              number="02"
              icon={FiEye}
              title="How we use your information"
            >
              <p>
                Information is used for legitimate purposes connected to
                providing and improving Solvix AI.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  [FiUserCheck, "Manage your account"],
                  [FiCpu, "Provide AI features"],
                  [FiActivity, "Process requests"],
                  [FiShield, "Maintain security"],
                  [FiAlertTriangle, "Prevent abuse"],
                  [FiSettings, "Improve the platform"],
                  [FiMail, "Send service updates"],
                  [FiFileText, "Meet legal requirements"],
                ].map(([Icon, text]) => (
                  <div
                    key={text}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                      <Icon size={14} className="text-[#c9a468]/80" />
                    </div>

                    <span className="text-xs leading-5 text-white/55 group-hover:text-white/75">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </PrivacySection>
          </div>

          {}
          <div className="mt-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {}
            <PrivacySection
              id="section-03"
              number="03"
              icon={FiCpu}
              title="AI and your data"
            >
              <p>
                Solvix uses AI models and supporting infrastructure to power
                conversations, research, coding, document processing, and other
                intelligent workflows.
              </p>

              <p>
                When you use an AI feature, the information required to process
                your request may be transmitted to the relevant AI service.
              </p>

              <div className="mt-8 w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                <div className="border-b border-white/[0.08] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
                      <FiCpu size={15} className="text-[#d9bd88]" />
                    </div>

                    <div>
                      <div className="text-[13px] font-medium text-white/85">
                        AI processing
                      </div>

                      <div className="mt-0.5 text-[11px] text-white/35">
                        Secure request flow
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 sm:grid-cols-3">
                  {[
                    {
                      number: "01",
                      icon: FiEdit3,
                      title: "Your input",
                      text: "Prompt or content",
                    },
                    {
                      number: "02",
                      icon: FiShield,
                      title: "Solvix",
                      text: "Secure orchestration",
                    },
                    {
                      number: "03",
                      icon: FiCpu,
                      title: "AI model",
                      text: "Generated response",
                    },
                  ].map(({ number, icon: Icon, title, text }, index) => (
                    <div
                      key={number}
                      className={`p-5 sm:p-6 ${
                        index !== 0
                          ? "border-t border-white/[0.08] sm:border-l sm:border-t-0"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c9a468]/60">
                          {number}
                        </span>

                        <Icon size={14} className="text-white/25" />
                      </div>

                      <div className="mt-4 text-sm font-medium text-white/85">
                        {title}
                      </div>

                      <div className="mt-1 text-[11px] leading-5 text-white/35">
                        {text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#c9a468]/20 bg-[#c9a468]/[0.045] p-4">
                <FiShield
                  size={15}
                  className="mt-0.5 shrink-0 text-[#d9bd88]"
                />

                <p className="!mt-0 text-[12px] leading-6 text-white/50">
                  Avoid submitting highly sensitive personal information unless
                  it is necessary for the feature you are using.
                </p>
              </div>
            </PrivacySection>

            {}
            <PrivacySection
              id="section-04"
              number="04"
              icon={FiLock}
              title="Data security"
            >
              <p>
                We use reasonable technical and organizational measures designed
                to protect information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>

              <div className="mt-8 grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.07] sm:grid-cols-2">
                {[
                  {
                    icon: FiLock,
                    title: "Encrypted connections",
                    text: "Protected communication between systems.",
                  },
                  {
                    icon: FiKey,
                    title: "Secure authentication",
                    text: "Account access is protected with secure authentication.",
                  },
                  {
                    icon: FiUsers,
                    title: "Controlled access",
                    text: "Access is limited to authorized systems and personnel.",
                  },
                  {
                    icon: FiServer,
                    title: "Infrastructure protection",
                    text: "Security controls protect underlying infrastructure.",
                  },
                  {
                    icon: FiActivity,
                    title: "Security monitoring",
                    text: "Systems are monitored for suspicious activity.",
                  },
                  {
                    icon: FiShield,
                    title: "Abuse prevention",
                    text: "Controls help detect and prevent misuse.",
                  },
                ].map(({ icon: Icon, title, text }, index) => (
                  <div
                    key={title}
                    className={`
                      group p-5 transition-colors duration-300
                      hover:bg-white/[0.025]
                      ${
                        index % 2 !== 0
                          ? "sm:border-l sm:border-white/[0.07]"
                          : ""
                      }
                      ${index >= 2 ? "border-t border-white/[0.07]" : ""}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
                        <Icon size={14} className="text-[#c9a468]/80" />
                      </div>

                      <div>
                        <h3 className="text-xs font-medium text-white/75">
                          {title}
                        </h3>

                        <p className="!mt-1 text-[11px] leading-5 text-white/35">
                          {text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PrivacySection>
          </div>

          {}
          <div className="mt-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {}
            <PrivacySection
              id="section-05"
              number="05"
              icon={FiUsers}
              title="When we share information"
            >
              <p>
                We do not sell your personal information. Information may be
                shared only when necessary to operate our services or comply
                with applicable requirements.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3">
                {[
                  {
                    icon: FiServer,
                    title: "Service providers",
                    text: "Hosting, authentication, analytics, storage, payment, and infrastructure providers.",
                  },
                  {
                    icon: FiCpu,
                    title: "AI providers",
                    text: "Services required to process AI requests and provide intelligent features.",
                  },
                  {
                    icon: FiFileText,
                    title: "Legal requirements",
                    text: "Where disclosure is required by law or necessary to protect our rights.",
                  },
                  {
                    icon: FiRefreshCw,
                    title: "Business transfers",
                    text: "In connection with a merger, acquisition, restructuring, or asset transfer.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.035]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                      <Icon size={14} className="text-[#c9a468]/75" />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-white/75">
                        {title}
                      </h3>

                      <p className="!mt-1 text-[11px] leading-5 text-white/35">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PrivacySection>

            {}
            <PrivacySection
              id="section-06"
              number="06"
              icon={FiClock}
              title="Data retention"
            >
              <p>
                We retain information for as long as reasonably necessary to
                provide services, maintain security, resolve disputes, and
                satisfy legal or operational requirements.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3">
                {[
                  {
                    icon: FiClock,
                    title: "Purpose-based retention",
                    text: "Information is retained according to why it was collected.",
                  },
                  {
                    icon: FiShield,
                    title: "Security requirements",
                    text: "Some information may be retained to protect accounts and prevent abuse.",
                  },
                  {
                    icon: FiFileText,
                    title: "Legal requirements",
                    text: "Certain records may need to remain available for legal or regulatory reasons.",
                  },
                  {
                    icon: FiTrash2,
                    title: "Deletion",
                    text: "Eligible information may be deleted when no longer reasonably required.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.035]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                      <Icon size={14} className="text-[#c9a468]/75" />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-white/75">
                        {title}
                      </h3>

                      <p className="!mt-1 text-[11px] leading-5 text-white/35">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PrivacySection>
          </div>

          {}
          <div className="mt-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {}
            <PrivacySection
              id="section-07"
              number="07"
              icon={FiUserCheck}
              title="Your data rights"
            >
              <p>
                Depending on your location and applicable law, you may have
                rights regarding the personal information we hold about you.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: FiEye,
                    title: "Access",
                    text: "Request information about personal data we hold.",
                  },
                  {
                    icon: FiDownload,
                    title: "Export",
                    text: "Request a copy of eligible personal information.",
                  },
                  {
                    icon: FiEdit3,
                    title: "Correction",
                    text: "Request correction of inaccurate information.",
                  },
                  {
                    icon: FiTrash2,
                    title: "Deletion",
                    text: "Request deletion of eligible information.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.035]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                        <Icon size={14} className="text-[#c9a468]/80" />
                      </div>

                      <h3 className="text-xs font-medium text-white/75">
                        {title}
                      </h3>
                    </div>

                    <p className="!mt-3 text-[11px] leading-5 text-white/35">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </PrivacySection>

            {}
            <PrivacySection
              id="section-08"
              number="08"
              icon={FiSettings}
              title="Cookies and similar technologies"
            >
              <p>
                We may use cookies and similar technologies to maintain
                sessions, remember preferences, understand platform usage, and
                improve functionality.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3">
                {[
                  {
                    icon: FiSettings,
                    title: "Preferences",
                    text: "Remember settings and choices that improve your experience.",
                  },
                  {
                    icon: FiUserCheck,
                    title: "Authentication",
                    text: "Maintain secure sessions and account access.",
                  },
                  {
                    icon: FiActivity,
                    title: "Analytics",
                    text: "Understand platform usage and improve performance.",
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.035]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                      <Icon size={14} className="text-[#c9a468]/75" />
                    </div>

                    <div>
                      <h3 className="text-xs font-medium text-white/75">
                        {title}
                      </h3>

                      <p className="!mt-1 text-[11px] leading-5 text-white/35">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-6 text-white/40">
                You can manage certain cookie preferences through your browser
                settings. Disabling cookies may affect some platform features.
              </p>
            </PrivacySection>
          </div>

          {}
          <div className="mt-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {}
            <PrivacySection
              id="section-09"
              number="09"
              icon={FiServer}
              title="Third-party services"
            >
              <p>
                Solvix AI may integrate with third-party services for
                authentication, payments, analytics, cloud storage, AI
                processing, communication, and infrastructure.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: FiGlobe,
                    title: "Infrastructure",
                  },
                  {
                    icon: FiCpu,
                    title: "AI processing",
                  },
                  {
                    icon: FiLock,
                    title: "Authentication",
                  },
                  {
                    icon: FiFileText,
                    title: "Payments",
                  },
                ].map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                      <Icon size={14} className="text-[#c9a468]/75" />
                    </div>

                    <span className="text-xs text-white/55">{title}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-6 text-white/40">
                These services may process information according to their own
                privacy policies and terms.
              </p>
            </PrivacySection>

            {}
            <PrivacySection
              id="section-10"
              number="10"
              icon={FiRefreshCw}
              title="Changes to this policy"
            >
              <p>
                We may update this Privacy Policy from time to time. Significant
                changes may be communicated through the platform or other
                appropriate channels.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                    <FiRefreshCw size={14} className="text-[#c9a468]/75" />
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-white/75">
                      Policy updates
                    </h3>

                    <p className="!mt-1 text-[11px] leading-5 text-white/35">
                      We may revise this policy when our services, practices, or
                      requirements change.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035]">
                    <FiCheckCircle size={14} className="text-[#c9a468]/75" />
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-white/75">
                      Continued use
                    </h3>

                    <p className="!mt-1 text-[11px] leading-5 text-white/35">
                      Continued use of Solvix after changes become effective
                      means you acknowledge the updated policy.
                    </p>
                  </div>
                </div>
              </div>
            </PrivacySection>
          </div>

          {}
          <section className="relative mt-16 w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 sm:mt-20 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#c9a468]/[0.06] blur-[110px]" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-[#c9a468]/40 via-[#c9a468]/10 to-transparent" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.05]">
                <FiMail size={17} className="text-[#d9bd88]" />
              </div>

              <div className="mt-7 max-w-2xl">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#c9a468]/70">
                  Need help?
                </span>

                <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  Questions about your data?
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  If you have questions about our privacy practices, your
                  information, or your data rights, our team is here to help.
                </p>

                <Link
                  to="/contact"

                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#e9e7e2] px-5 py-3 text-xs font-semibold text-[#0b0c0e] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:shadow-black/20"
                >
                  Contact privacy team
                  <FiArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>
          </section>

          {}
        </div>
      </div>
    </main>
  );
};

export default PrivacyContent;
