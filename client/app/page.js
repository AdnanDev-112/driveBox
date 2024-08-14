import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between  bg-gradient-to-r from-yellow-500 to-orange-500">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-2 px-4 bg-orange-200 shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">
          <Image src={"/logo.png"} height={100} width={100} />
        </h1>
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link href={"#features"}
                className="bg-orange-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:text-yellow-200 transition-colors duration-300"
              >
                Features
              </Link>
            </li>
            <li>
              <Link href={"#how-it-works"}
                className="bg-orange-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:text-yellow-200 transition-colors duration-300"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link href={"/account/register"}
                className="bg-orange-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:text-yellow-200 transition-colors duration-300"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24  rounded p-10">
        <h2 className="text-6xl font-extrabold mb-6 animate-fadeInUp">Secure Your Files with BoxMe</h2>
        <p className="text-2xl mb-10 animate-fadeInUp delay-200">
          Utilizing Facial Recognition and Blockchain Technology
        </p>
        <Link
          href="/account/register"
          className="bg-white  px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition duration-300 shadow-lg animate-bounce">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Facial Recognition</h4>
            <p className="text-gray-600">Secure your files with advanced facial recognition technology.</p>
          </div>
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Blockchain Security</h4>
            <p className="text-gray-600">Ensure data integrity and security with blockchain technology.</p>
          </div>
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Easy Access</h4>
            <p className="text-gray-600">Access your files from anywhere, anytime with our cloud solution.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 ">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Step 1</h4>
            <p className="text-gray-600">Sign up and create your account.</p>
          </div>
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Step 2</h4>
            <p className="text-gray-600">Upload your files securely.</p>
          </div>
          <div className="w-80 p-6 bg-white shadow-xl rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h4 className="text-2xl font-semibold mb-4 text-blue-600">Step 3</h4>
            <p className="text-gray-600">Access your files using facial recognition.</p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-full py-10 bg-orange-200 shadow-lg text-center">
        <p className="text-gray-600">&copy; 2024 BoxMe. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-600 hover:text-blue-700 transition duration-300">
            Facebook
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-700 transition duration-300">
            Twitter
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-700 transition duration-300">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
