import Image from "next/image";
import Link from "next/link";
import Navbar from '@/app/components/navbar';

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div>Hello This is home hehehehehehe</div>
      <Link href='/admin'>Open Admin</Link>

    </div>
    
  );
}
