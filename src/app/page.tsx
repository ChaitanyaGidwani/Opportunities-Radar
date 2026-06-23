import { redirect } from "next/navigation";

/** Golden rule #1: Open straight into the product. / → /feed */
export default function Home() {
  redirect("/feed");
}
