"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700 backdrop-blur-sm bg-gray-900/70 sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="pl-10 text-2xl font-bold">TaskMaster</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#features">
            <span className="hover:text-purple-400 transition">Features</span>
          </Link>
          <Link href="/#testimonials">
            <span className="hover:text-purple-400 transition">Testimonials</span>
          </Link>
          <Link href="/#faq">
            <span className="hover:text-purple-400 transition">FAQ</span>
          </Link>
        </nav>
        {!session ? (
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <span className="cursor-pointer rounded-full border border-purple-500 px-4 py-2 font-semibold shadow-md hover:bg-purple-600 hover:border-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                Sign In
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-gray-300">
              {greeting}, {session.user?.name?.split(" ")[0] || "there"}!
            </span>
            <Link href="/dashboard">
              <span className="cursor-pointer rounded-full bg-purple-600 px-4 py-2 font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                Dashboard
              </span>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Stay Organized, Achieve More
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Welcome to TaskMaster – your ultimate solution for managing tasks and boosting your productivity. Track tasks, set deadlines, and collaborate with your team seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            {!session ? (
              <>
                <Link href="/login">
                  <span className="w-full sm:w-auto cursor-pointer rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                    Get Started
                  </span>
                </Link>
                <Link href="/#features">
                  <span className="w-full sm:w-auto cursor-pointer rounded-full border border-white px-8 py-4 text-lg font-semibold shadow-md hover:bg-white/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition">
                    Learn More
                  </span>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <span className="cursor-pointer rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                  Go to Dashboard
                </span>
              </Link>
            )}
          </div>
          
          {/* App Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-gray-700">
              <div className="flex items-center mb-4 space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4 bg-gray-700 rounded-md px-2 text-xs py-1 flex-grow text-left">
                  TaskMaster Dashboard
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-left">Today's Tasks</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex items-center">
                      <input type="checkbox" checked className="mr-2" readOnly />
                      <span className="line-through text-gray-400">Morning standup meeting</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" readOnly />
                      <span>Finalize project proposal</span>
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" readOnly />
                      <span>Review pull requests</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-left">Upcoming Deadlines</h3>
                  <ul className="space-y-2 text-left">
                    <li className="flex justify-between">
                      <span>Client presentation</span>
                      <span className="text-purple-400">Tomorrow</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sprint review</span>
                      <span className="text-purple-400">3 days</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Team building</span>
                      <span className="text-purple-400">1 week</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TaskMaster</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Organization</h3>
              <p className="text-gray-300">Organize tasks into projects, categories, and priorities with our drag-and-drop interface.</p>
            </div>
            <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-300">Share tasks, assign responsibilities, and track progress with your team in real-time.</p>
            </div>
            <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p className="text-gray-300">Never miss a deadline with customizable notifications across multiple devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">S</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"TaskMaster has completely transformed how our marketing team collaborates. The intuitive interface and smart reminders have increased our productivity by 40%!"</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">M</div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-400 text-sm">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"As a developer, I need to keep track of bugs, features, and deadlines. TaskMaster makes it easy with its powerful organization tools and seamless integration with our workflow."</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Is TaskMaster free to use?</h3>
              <p className="text-gray-300">TaskMaster offers a free tier with essential features. Premium plans with advanced features start at $4.99/month.</p>
            </div>
            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Can I access TaskMaster on mobile devices?</h3>
              <p className="text-gray-300">Yes! TaskMaster is available on iOS and Android, with full synchronization across all your devices.</p>
            </div>
            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">How secure is my data?</h3>
              <p className="text-gray-300">We use industry-standard encryption and security practices to ensure your data remains private and secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of users who have transformed their workflow with TaskMaster.
          </p>
          {!session ? (
            <Link href="/signup">
              <span className="cursor-pointer rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition inline-block">
                Start Your Free Trial
              </span>
            </Link>
          ) : (
            <Link href="/dashboard">
              <span className="cursor-pointer rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition inline-block">
                Go to Dashboard
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold">TaskMaster</h3>
              </div>
              <p className="text-gray-400">Your ultimate productivity companion for managing tasks efficiently.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/features"><span className="text-gray-400 hover:text-white transition">Features</span></Link></li>
                <li><Link href="/pricing"><span className="text-gray-400 hover:text-white transition">Pricing</span></Link></li>
                <li><Link href="/about"><span className="text-gray-400 hover:text-white transition">About Us</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/faq"><span className="text-gray-400 hover:text-white transition">FAQ</span></Link></li>
                <li><Link href="/contact"><span className="text-gray-400 hover:text-white transition">Contact</span></Link></li>
                <li><Link href="/help"><span className="text-gray-400 hover:text-white transition">Help Center</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms"><span className="text-gray-400 hover:text-white transition">Terms of Service</span></Link></li>
                <li><Link href="/privacy"><span className="text-gray-400 hover:text-white transition">Privacy Policy</span></Link></li>
                <li><Link href="/cookies"><span className="text-gray-400 hover:text-white transition">Cookie Policy</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325v21.351C0 23.407 0.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12V24h6.116c0.73 0 1.323-0.593 1.323-1.325V1.325C24 0.593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.423-.016-.632.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 16H8v-6h2v6zM9 9.109c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zM17 16h-2v-3.5c0-.763-.202-1.5-1.5-1.5-.748 0-1.265.507-1.478 1-.08.14-.122.333-.122.554V16h-2v-6h2v1c.43-.626 1.202-1 2.1-1 1.414 0 3 .913 3 3.3V16z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}