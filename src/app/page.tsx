"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";

export default function Home() {
  // We no longer need a stateless vectorStore here!
  // Our documents are safely stored in MongoDB Atlas Vector Search.
  return (
    <main className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans">
      <Sidebar />
      <Chat />
    </main>
  );
}
