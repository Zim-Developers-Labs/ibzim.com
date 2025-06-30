import { Icons } from "@/components/icons";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const policies = [
  {
    name: "Privacy Policy",
    description:
      "Explains what information we collect and why, how we use it, and how to review and update it.",
    link: {
      text: "Read our Privacy Policy",
      url: "/policies/privacy",
    },
    icon: Icons.privacyPolicyIcon,
  },
  {
    name: "Terms and Conditions",
    description: "Describes the rules you agree to when using our platform.",
    link: {
      text: "Read our Terms and Condition",
      url: "/policies/terms",
    },
    icon: Icons.termsIcon,
  },
  {
    name: "Commenting Policy",
    description:
      "Guidelines on how to contribute to our safe commenting space.",
    link: {
      text: "Read our Commenting Policy",
      url: "/policies/commenting",
    },
    icon: Icons.commentsPolicyIcon,
  },
  {
    name: "Disclaimer",
    description:
      "What you must know before you take action based on information on IBZim.",
    link: {
      text: "Read full disclaimer",
      url: "/policies/disclaimer",
    },
    icon: Icons.disclaimerIcon,
  },
];

export default function PoliciesWrapper() {
  return (
    <main className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-light mb-8 text-center">Our Policies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg mx-auto">
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <div
              key={policy.name}
              className="bg-white rounded-lg  overflow-hidden flex flex-col items-center h-full  py-12 px-8"
            >
              <Icon className="w-10 h-10 mb-4 text-primaryColor" />
              <h2 className="text-xl mb-2">{policy.name}</h2>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {policy.description}
              </p>
              <Link
                href={policy.link.url}
                className="flex items-center gap-2 text-primaryColor w-fit py-2 px-4 text-center  rounded-md transition duration-150 ease-in-out"
              >
                {policy.link.text}
                <ChevronRightIcon className="h-4 w-fit" />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
