import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCamera } from "@/hooks/useCamera"
import { PHOTO_STRIP_TEMPLATES } from "@/constants/templates"
import { Preview } from "./Preview"
import { Countdown } from "./Countdown"
import { PrivacyNotice } from "@/components/PrivacyNotice"
import { motion, AnimatePresence } from "framer-motion"
import {
	Zap,
	ZapOff,
	Sparkles,
	Camera,
	SunDim,
	Lock,
	Sun,
	Moon,
	Sunset,
	Clock,
} from "lucide-react"

export const PhotoBooth = () => {
	const {
		videoRef,
		startCamera,
		stopCamera,
		takePhoto,
		error,
		isReady,
		isActive,
	} = useCamera()
	const [photos, setPhotos] = useState([])
	const [selectedTemplate, setSelectedTemplate] = useState(
		PHOTO_STRIP_TEMPLATES[0]
	)
	const [isCapturing, setIsCapturing] = useState(false)
	const [showPreview, setShowPreview] = useState(false)
	const [countdownActive, setCountdownActive] = useState(false)
	const [selectedFilter, setSelectedFilter] = useState("none") // none, bw, sepia, vintage
	const [flashSupported, setFlashSupported] = useState(false)
	const [flashEnabled, setFlashEnabled] = useState(false)

	const filterStyles = {
		none: "",
		bw: "grayscale(100%)",
		sepia: "sepia(100%)",
		vintage: "sepia(50%) contrast(85%) brightness(90%)",
		golden:
			"sepia(30%) brightness(105%) contrast(95%) saturate(120%) hue-rotate(-5deg)",
	}

	const filterIcons = {
		none: Camera,
		bw: Moon,
		sepia: Sunset,
		vintage: Clock,
		golden: Sun,
	}

	const filterNames = {
		none: "Normal",
		bw: "B&W",
		sepia: "Sepia",
		vintage: "Vintage",
		golden: "Golden Hour",
	}

	useEffect(() => {
		return () => {
			stopCamera()
		}
	}, [stopCamera])

	useEffect(() => {
		const checkFlashSupport = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "environment",
						advanced: [{ torch: true }],
					},
				})

				const track = stream.getVideoTracks()[0]
				const capabilities = track.getCapabilities()
				const settings = track.getSettings()

				// Check if torch/flash is supported
				setFlashSupported("torch" in capabilities || "torch" in settings)

				// Clean up stream
				stream.getTracks().forEach((track) => track.stop())
			} catch (err) {
				console.error("Error checking flash support:", err)
				setFlashSupported(false)
			}
		}

		checkFlashSupport()
	}, [])

	useEffect(() => {
		const toggleFlash = async () => {
			if (!videoRef.current) return

			try {
				const track = videoRef.current.srcObject?.getVideoTracks()[0]
				if (track) {
					await track.applyConstraints({
						advanced: [{ torch: flashEnabled }],
					})
				}
			} catch (err) {
				console.error("Error toggling flash:", err)
				setFlashEnabled(false)
			}
		}

		if (isActive) {
			toggleFlash()
		}
	}, [flashEnabled, isActive])

	const handleStartSession = async () => {
		setIsCapturing(true)
		await startCamera()
	}

	const handleCapture = () => {
		if (!isReady) {
			console.log("Camera not ready for capture")
			return
		}

		const photo = takePhoto(selectedFilter)
		if (photo) {
			const newPhotos = [...photos, { src: photo, filter: "none" }]
			setPhotos(newPhotos)

			if (newPhotos.length < 3) {
				setTimeout(() => {
					setCountdownActive(true)
				}, 1000)
			} else {
				setCountdownActive(false)
				setShowPreview(true)
				setIsCapturing(false)
				stopCamera()
			}
		} else {
			console.error("Failed to take photo")
		}
	}

	const startPhotoSequence = () => {
		if (!isReady) {
			console.log("Camera not ready for capture")
			return
		}
		setCountdownActive(true)
	}

	const handleCountdownComplete = () => {
		setCountdownActive(false)
		handleCapture()
	}

	if (showPreview) {
		return <Preview photos={photos} template={selectedTemplate} />
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="w-full max-w-4xl mx-auto p-4"
			>
				{error ? (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="w-full p-4 mb-4 text-red-800 bg-red-50 rounded-lg flex items-center justify-between"
					>
						<div className="flex items-center">
							<svg
								className="w-5 h-5 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{error}</span>
						</div>
						<button
							onClick={() => {
								setError(null)
								startCamera()
							}}
							className="text-sm font-medium text-red-800 hover:text-red-900"
						>
							Try Again
						</button>
					</motion.div>
				) : null}

				<div className="w-full max-w-2xl mx-auto p-4">
					<AnimatePresence mode="wait">
						{isCapturing ? (
							<motion.div
								key="capture"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ type: "spring", stiffness: 300, damping: 25 }}
								className="relative flex flex-col w-full gap-4"
							>
								{isActive && (
									<div className="absolute left-0 md:left-[-4rem] top-0 md:top-1/2 md:-translate-y-1/2 flex md:flex-col flex-row gap-1 bg-white/80 backdrop-blur-sm p-0.5 sm:p-1 rounded-lg h-fit z-10">
										<span className="hidden sm:block text-[10px] font-medium text-gray-600 text-center mb-1">
											Filters
										</span>
										{Object.entries(filterStyles).map(([filter, style]) => {
											const Icon = filterIcons[filter]
											return (
												<motion.div
													key={filter}
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{
														duration: 0.2,
													}}
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<button
														onClick={() => setSelectedFilter(filter)}
														className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 group relative ${
															selectedFilter === filter
																? "text-black bg-white/50"
																: "text-gray-500 hover:text-black hover:bg-white/50"
														}`}
														title={filterNames[filter]}
													>
														<Icon
															className={`w-4 h-4 sm:w-5 sm:h-5 ${
																selectedFilter === filter
																	? "scale-110"
																	: "scale-100"
															}`}
														/>
														<span className="absolute top-full left-1/2 -translate-x-1/2 sm:left-full sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 mt-1 sm:mt-0 sm:ml-2 px-2 py-1 bg-black/75 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
															{filterNames[filter]}
														</span>
													</button>
												</motion.div>
											)
										})}
									</div>
								)}
								<div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-12 md:mt-0">
									<motion.div
										className="w-full md:flex-1"
										initial={{ x: -20 }}
										animate={{ x: 0 }}
									>
										<div className="relative aspect-square border-2 border-black bg-black rounded-lg shadow-lg overflow-hidden mb-4">
											{!isActive && !error && (
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="text-white text-center">
														<svg
															className="animate-spin h-8 w-8 mx-auto mb-2"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
														>
															<circle
																className="opacity-25"
																cx="12"
																cy="12"
																r="10"
																stroke="currentColor"
																strokeWidth="4"
															></circle>
															<path
																className="opacity-75"
																fill="currentColor"
																d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
															></path>
														</svg>
														<span>Initializing camera...</span>
													</div>
												</div>
											)}
											<video
												ref={videoRef}
												autoPlay
												playsInline
												muted
												style={{ filter: filterStyles[selectedFilter] }}
												className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
											/>
											{countdownActive && (
												<Countdown onComplete={handleCountdownComplete} />
											)}
										</div>
										<motion.div
											className="flex justify-between items-center w-full"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.2 }}
										>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												className="flex gap-2 items-center justify-center"
											>
												<Button
													variant="outline"
													size="icon"
													onClick={() => setFlashEnabled(!flashEnabled)}
													className="w-10 h-10"
													title={
														flashEnabled ? "Turn Flash Off" : "Turn Flash On"
													}
												>
													{flashEnabled ? (
														<Zap className="h-8 w-8" />
													) : (
														<ZapOff className="h-8 w-8" />
													)}
												</Button>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													onClick={startPhotoSequence}
													className="px-4 py-3 bg-black text-white hover:bg-black/90"
													disabled={!isReady || countdownActive}
												>
													Take Photo {photos.length + 1}/3
												</Button>
											</motion.div>
										</motion.div>
									</motion.div>
									<motion.div
										className="flex md:w-40 w-full md:flex-col gap-4 pb-2"
										initial={{ x: 20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.3 }}
									>
										<div className="grid grid-cols-3 md:grid-cols-1 w-full gap-4">
											<AnimatePresence>
												{photos.map((photo, index) => (
													<motion.div
														key={index}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.8 }}
														transition={{
															type: "spring",
															stiffness: 300,
															damping: 25,
														}}
														className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
													>
														<motion.img
															initial={{ scale: 1.2 }}
															animate={{ scale: 1 }}
															src={photo.src}
															alt={`Photo ${index + 1}`}
															className="w-full h-full object-cover"
															style={{ filter: filterStyles[photo.filter] }}
														/>
													</motion.div>
												))}
											</AnimatePresence>
										</div>
									</motion.div>
								</div>
							</motion.div>
						) : (
							<motion.div
								key="welcome"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center"
							>
								<div className="space-y-4 sm:space-y-6">
									<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
										Ready for your photo strip?
									</h1>
									<div className="space-y-4 text-gray-600">
										<p className="text-base sm:text-sm md:text-xl">
											Create memories that last forever with our photobooth!
										</p>
										<ul className="space-y-3 text-left max-w-md mx-auto text-sm sm:text-base">
											<li className="flex items-start gap-3">
												<svg
													className="w-5 h-5 flex-shrink-0 text-black mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												</svg>
												<span>
													Take 3 unique photos in sequence - completely free!
												</span>
											</li>
											<li className="flex items-start gap-3">
												<svg
													className="w-5 h-5 flex-shrink-0 text-black mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												<span>
													Enjoy a fun 3-second countdown between shots
												</span>
											</li>
											<li className="flex items-start gap-3">
												<svg
													className="w-5 h-5 flex-shrink-0 text-black mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span>Choose from free premium frame styles</span>
											</li>
											<li className="flex items-start gap-3">
												<svg
													className="w-5 h-5 flex-shrink-0 text-black mt-0.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
													/>
												</svg>
												<span>
													Download your photo strips instantly - no cost!
												</span>
											</li>
											<li className="flex items-start gap-3">
												<Lock className="w-5 h-5 flex-shrink-0 text-black mt-0.5" />
												<span>
													Your photos stay private. We don't store, collect, or
													share any of your photos.
												</span>
											</li>
										</ul>
									</div>
								</div>

								<motion.div
									className="flex flex-col items-center gap-3 w-full sm:w-auto"
									whileHover={{ scale: 1.02 }}
								>
									<Button
										onClick={handleStartSession}
										className="w-full sm:w-auto bg-black hover:bg-black/90 text-white text-base sm:text-lg rounded-lg px-6 sm:px-8 py-2.5 sm:py-3"
									>
										Start Photo Session
									</Button>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				{isCapturing && !showPreview && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-4 right-4 z-10 flex gap-2"
					></motion.div>
				)}
			</motion.div>
			<PrivacyNotice forceHide={isCapturing} />
		</>
	)
}
