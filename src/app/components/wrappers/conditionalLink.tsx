import Link from "next/link";

type ConditionalLinkProps = {
  href?: string;
  children: React.ReactNode;
};

export default function ConditionalLink({ href, children }: ConditionalLinkProps) {
  return href ? <Link href={href}>{children}</Link> : <>{children}</>;
}