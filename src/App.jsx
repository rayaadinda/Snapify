import React, { useState, useEffect } from "react"
import logo from "./assets/logo.png"
import hero from "./assets/hero2.png"
import { Button } from "./components/ui/button"
import { PhotoBooth } from "./components/photobooth/PhotoBooth"
import { PrivacyNotice } from "./components/PrivacyNotice"
import { Analytics } from "@vercel/analytics/react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from 'react-hot-toast'


const APP_VERSION = '1.2.0' 
const APP_VERSION_KEY = 'snapify-version'

function App() {
	const [showPhotoBooth, setShowPhotoBooth] = useState(false)

	useEffect(() => {
		const lastVersion = localStorage.getItem(APP_VERSION_KEY)
		if (!lastVersion || lastVersion !== APP_VERSION) {
		
			toast.custom(
				(t) => (
					<div
						className={`${
							t.visible ? 'animate-enter' : 'animate-leave'
						} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
					>
						<div className="flex-1 w-0 p-4">
							<div className="flex items-start">
								<div className="flex-shrink-0 pt-0.5">
									<img
										className="h-10 w-10 rounded-full"
										src={logo}
										alt="Snapify"
									/>
								</div>
								<div className="ml-3 flex-1">
									<p className="text-sm font-semibold text-black">
										New Features Available! 🎉
									</p>
									<p className="mt-1 text-sm font-medium text-gray-500">
										• New photo template
									</p>
								</div>
							</div>
						</div>
						<div className="flex border-l border-gray-200">
							<button
								onClick={() => toast.dismiss(t.id)}
								className="p-2 border border-transparent rounded-r-lg flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
							>
								<svg
									className="h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="red"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								<span className="sr-only">Close</span>
							</button>
						</div>
					</div>
				),
				{
					duration: 5000,
					position: 'top-center',
				}
			)

			// Save the current version
			localStorage.setItem(APP_VERSION_KEY, APP_VERSION)
		}
	}, [])

	if (showPhotoBooth) {
		return (
			<div className="min-h-screen bg-white">
				<Toaster />
				<div className="w-full max-w-6xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between mb-8">
						<div
							className="flex items-center gap-2"
							onClick={() => setShowPhotoBooth(false)}
						>
							<img
								src={logo}
								alt="Snapify Logo"
								className="w-6 h-6 md:w-8 md:h-8"
							/>
							<span
								className="font-medium text-lg md:text-xl"
								style={{ fontStyle: "italic" }}
							>
								Snapify
							</span>
						</div>
					</div>
					<main className="flex-1">
						<PhotoBooth />
					</main>
					<PrivacyNotice />
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Toaster />
			<div className="flex flex-col min-h-screen bg-white px-4 py-6">
				<div className="w-full max-w-6xl mx-auto mb-8 md:mb-16">
					<div className="flex items-center">
						<img
							src={logo}
							alt="Snapify Logo"
							className="w-6 h-6 md:w-8 md:h-8"
						/>
						<span
							className="font-medium text-lg md:text-xl"
							style={{ fontStyle: "italic" }}
						>
							Snapify
						</span>
					</div>
				</div>

				<div className="flex flex-col items-center max-w-3xl mx-auto text-center flex-grow">
					<div className="w-[280px] sm:w-full mx-auto mb-8 md:mb-16">
						<h1
							className="text-[32px] sm:text-[36px] font- sm:font-medium tracking-tight leading-[1.4] sm:leading-normal"
							style={{ fontStyle: "italic" }}
						>
							<span className="block text-right sm:hidden">Capture Every</span>
							<span className="block text-right sm:hidden">Moment,</span>
							<span className="block text-right sm:hidden">Anytime,</span>
							<span className="block text-right sm:hidden">Anywhere</span>
							<span className="hidden sm:block">
								Capture Every Moment, Anytime, Anywhere
							</span>
						</h1>
					</div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="w-full flex items-center justify-center max-w-md md:max-w-2xl mb-4 md:mb-8 px-4"
					>
						<img
							src={hero}
							alt="Photo collage"
							width={500}
							height={500}
							className="object-contain"
						/>
					</motion.div>

					<Button
						variant="default"
						className="bg-black hover:bg-black text-white rounded-lg px-8 py-4 text-base font-semibold"
						onClick={() => setShowPhotoBooth(true)}
					>
						Try now!
					</Button>
				</div>
			</div>

			<footer className="w-full border-t border-gray-100 mt-auto">
				<div className="max-w-6xl mx-auto px-4 py-6">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
						<div className="flex items-center gap-2">
							<span> 2025 Raya Adinda. All rights reserved.</span>
						</div>
					</div>
				</div>
			</footer>
			<Analytics />
		</div>
	)
}

export default App
