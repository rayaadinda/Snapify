import { useState, useRef, useCallback, useEffect } from "react"

export const useCamera = () => {
	const videoRef = useRef(null)
	const [isActive, setIsActive] = useState(false)
	const [isReady, setIsReady] = useState(false)
	const [error, setError] = useState(null)

	const cleanupCamera = useCallback(() => {
		if (videoRef.current?.srcObject) {
			const tracks = videoRef.current.srcObject.getTracks()
			tracks.forEach((track) => track.stop())
			videoRef.current.srcObject = null
		}
		setIsActive(false)
		setIsReady(false)
	}, [])

	useEffect(() => {
		return () => {
			cleanupCamera()
		}
	}, [cleanupCamera])

	const startCamera = async (facingMode = "user") => {
		cleanupCamera()

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: facingMode,
					width: { ideal: 1920 },
					height: { ideal: 1080 },
					...(facingMode === "environment" && {
						advanced: [{ torch: false }],
					}),
				},
			})

			if (videoRef.current) {
				videoRef.current.srcObject = stream
				await new Promise((resolve) => {
					videoRef.current.onloadedmetadata = () => {
						setIsReady(true)
						setIsActive(true)
						setError(null)
						resolve()
					}
				})
			}
		} catch (err) {
			console.error("Error accessing camera:", err)
			setError(
				"Camera access was denied. Please enable camera access in your browser settings and try again."
			)
			setIsActive(false)
			setIsReady(false)
			throw err
		}
	}

	const stopCamera = useCallback(() => {
		cleanupCamera()
		setError(null)
	}, [cleanupCamera])

	const takePhoto = useCallback(
		(filter = "none") => {
			if (!videoRef.current || !isReady) {
				console.log("Camera not ready:", {
					isReady,
					hasVideo: !!videoRef.current,
				})
				return null
			}

			try {
				const video = videoRef.current

				// Make sure video dimensions are available
				if (!video.videoWidth || !video.videoHeight) {
					console.log("Video dimensions not ready")
					return null
				}

				const canvas = document.createElement("canvas")
				const size = Math.min(video.videoWidth, video.videoHeight)

				canvas.width = size
				canvas.height = size

				const ctx = canvas.getContext("2d")
				if (!ctx) {
					console.log("Could not get canvas context")
					return null
				}

				// Center crop the video frame
				const xStart = (video.videoWidth - size) / 2
				const yStart = (video.videoHeight - size) / 2

				// Mirror the context for front camera
				ctx.scale(-1, 1)
				ctx.translate(-size, 0)

				ctx.drawImage(video, xStart, yStart, size, size, 0, 0, size, size)

				// Reset transform
				ctx.setTransform(1, 0, 0, 1, 0, 0)

				// Apply filter effects
				if (filter !== "none") {
					// Create a temporary canvas to apply filters
					const tempCanvas = document.createElement("canvas")
					tempCanvas.width = size
					tempCanvas.height = size
					const tempCtx = tempCanvas.getContext("2d")

					if (tempCtx) {
						// Draw the original image
						tempCtx.drawImage(canvas, 0, 0)

						// Get image data
						const imageData = tempCtx.getImageData(0, 0, size, size)
						const data = imageData.data

						// Apply filters
						for (let i = 0; i < data.length; i += 4) {
							const r = data[i]
							const g = data[i + 1]
							const b = data[i + 2]

							if (filter === "bw") {
								const gray = 0.2989 * r + 0.587 * g + 0.114 * b
								data[i] = gray
								data[i + 1] = gray
								data[i + 2] = gray
							} else if (filter === "sepia") {
								data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
								data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
								data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
							} else if (filter === "vintage") {
								data[i] = Math.min(255, r * 0.5 + g * 0.5 + b * 0.5 + 30)
								data[i + 1] = Math.min(255, r * 0.4 + g * 0.4 + b * 0.4 + 20)
								data[i + 2] = Math.min(255, r * 0.3 + g * 0.3 + b * 0.3)
							}
						}

						// Put the filtered image data back
						tempCtx.putImageData(imageData, 0, 0)

						// Draw the filtered image back to the main canvas
						ctx.drawImage(tempCanvas, 0, 0)
					}
				}

				return canvas.toDataURL("image/jpeg", 0.95)
			} catch (err) {
				console.error("Error taking photo:", err)
				return null
			}
		},
		[isReady]
	)

	const toggleFlash = useCallback(async (enabled) => {
		if (!videoRef.current?.srcObject) return

		try {
			const track = videoRef.current.srcObject.getVideoTracks()[0]
			await track.applyConstraints({
				advanced: [{ torch: enabled }],
			})
		} catch (err) {
			console.error("Error toggling flash:", err)
		}
	}, [])

	return {
		videoRef,
		startCamera,
		stopCamera,
		takePhoto,
		toggleFlash,
		isActive,
		isReady,
		error,
		setError,
	}
}
