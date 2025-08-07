import Tools from "../../assets/Tools.png";
const LandHero = () => {
  return (
     <div className="w-full bg-gray-50 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">

          {/* Left Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Find Trusted Local Workers <br />
              <span className="text-green-600">Near You Instantly</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Plumbers, Electricians, Carpenters & more — book verified professionals near your area.
            </p>
            <div className="flex gap-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition">
                Find a Worker
              </button>
              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-100 transition">
                Post a Job
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src={Tools}
              alt="Worker Illustration"
              className="w-[500px] h-[500px] drop-shadow-xl"
            />

          </div>
        </div>
      </div>
  )
}

export default LandHero