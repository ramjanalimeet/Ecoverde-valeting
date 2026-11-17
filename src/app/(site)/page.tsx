import type { Metadata } from "next";
import ClonePage from "@/components/ClonePage";
import { cloneMetadata, getClonePage } from "@/lib/clone";

const page = getClonePage("")!;

export const metadata: Metadata = cloneMetadata(page);

export default function Home() {
  return <ClonePage page={page} path="/" />;
}
