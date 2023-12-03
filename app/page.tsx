import Link from "next/link";
import { SiFirebase } from "react-icons/si";
import { RiBox3Fill } from "react-icons/ri";

const Home = () => {
  return (
    <div className="text-center px-8">
      <h1 className="text-5xl font-bold mt-24">Share Files Online</h1>
      <div className="mt-16 flex justify-center gap-4 sm:flex-row flex-col">
        <Link
          className="bg-amber-500 hover:bg-amber-600 transition-colors py-3 px-6 rounded-md font-semibold"
          href="/firebase-storage"
        >
          <SiFirebase className="inline-block" /> upload with Firebase
        </Link>
        <Link
          className="bg-purple-600 hover:bg-purple-700 transition-colors py-3 px-6 rounded-md font-semibold"
          href="/edge-store"
        >
          <RiBox3Fill className="inline-block" /> upload with Edge Store
        </Link>
      </div>
    </div>
  )
}

export default Home;
