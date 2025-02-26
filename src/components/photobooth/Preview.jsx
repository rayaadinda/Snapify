import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import { motion } from "framer-motion"
import { PHOTO_STRIP_TEMPLATES } from "@/constants/templates"

export const Preview = ({ photos, template: initialTemplate }) => {
	const stripRef = useRef(null)
	const [template, setTemplate] = useState(initialTemplate)
	const [quality, setQuality] = useState("high")
	const canvasRef = useRef(null)

	const filterStyles = {
		none: "",
		bw: "grayscale(100%)",
		sepia: "sepia(100%)",
		vintage: "sepia(50%) contrast(85%) brightness(90%)",
	}

	const qualityOptions = {
		standard: { scale: 2, compression: 0.92 },
		high: { scale: 4, compression: 1.0 },
	}

	const handleTemplateChange = (newTemplate) => {
		setTemplate(newTemplate)
	}

	const renderPhotoStrip = () => {
		if (template.layout) {
			return (
				<canvas
					ref={canvasRef}
					className="w-full h-auto"
					style={{
						maxWidth: template.layout.width,
						maxHeight: template.layout.height,
					}}
				/>
			)
		}

		return (
			<div
				ref={stripRef}
				className={template.styles.container}
				style={template.styles}
			>
				{renderDecorations()}
				{photos.map((photo, index) => (
					<div key={index} className={template.styles.photo}>
						<img
							src={photo.src}
							alt={`Photo ${index + 1}`}
							className="w-full aspect-square object-cover"
							style={{ filter: filterStyles[photo.filter] }}
						/>
					</div>
				))}
			</div>
		)
	}

	const handleDownload = async () => {
		try {
			let downloadCanvas

			if (!stripRef.current) return
			downloadCanvas = await html2canvas(stripRef.current, {
				backgroundColor: template.styles.background,
				scale: qualityOptions[quality].scale,
				useCORS: true,
				logging: false,
				allowTaint: true,
				imageTimeout: 0,
				onclone: (clonedDoc) => {
					if (template.id === "wave-to-earth" || template.id === "NJZ") {
						const frameImg = clonedDoc.querySelector(".frame-image")
						if (frameImg) {
							frameImg.style.width = "auto"
							frameImg.style.maxWidth = "100%"
							frameImg.style.height = "100px"
							frameImg.style.objectFit = "contain"
						}
					}
				},
			})

			const link = document.createElement("a")
			link.download = `Snapify-${quality}-quality.png`
			link.href = downloadCanvas.toDataURL(
				"image/png",
				qualityOptions[quality].compression
			)
			link.click()
		} catch (error) {
			console.error("Error generating photo strip:", error)
		}
	}

	const renderDecorations = () => {
		if (!template.styles.decorations) return null

		return template.styles.decorations.map((decoration, index) => {
			if (
				(template.id === "wave-to-earth" || template.id === "NJZ") &&
				index === 0 &&
				template.styles.frameImage
			) {
				return (
					<div key={index} className={decoration}>
						<img
							src={template.styles.frameImage}
							alt="Frame"
							className="frame-image w-full h-auto object-contain mt-4"
							style={{
								maxHeight: "80px",
								width: "auto",
								margin: "0 auto",
							}}
						/>
					</div>
				)
			}

			return (
				<div key={index} className={decoration}>
					{template.styles.decorationContent?.[index] || ""}
				</div>
			)
		})
	}

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext("2d")
		const { width, height } = template.layout

		canvas.width = width
		canvas.height = height

		ctx.fillStyle = template.backgroundColor
		ctx.fillRect(0, 0, width, height)

		photos.forEach(async (photo, index) => {
			const img = new Image()
			img.src = photo.src
			await new Promise((resolve) => {
				img.onload = resolve
			})

			const position = template.layout.photoPositions[index]
			ctx.drawImage(
				img,
				position.x,
				position.y,
				template.layout.photoWidth,
				template.layout.photoHeight
			)
		})

		if (template.frameImage || template.styles?.frameImage) {
			const frameImg = new Image()
			frameImg.src = template.frameImage || template.styles.frameImage
			frameImg.onload = () => {
				const { framePosition, frameWidth, frameHeight } = template.layout
				ctx.drawImage(
					frameImg,
					framePosition.x,
					framePosition.y,
					frameWidth,
					frameHeight
				)
			}
		}
	}, [photos, template])

	return (
		<div className="flex flex-col lg:flex-row items-start justify-center w-full max-w-3xl mx-auto p-4 gap-8">
			<div
				className={
					template.layout
						? "w-full max-w-2xl mx-auto"
						: "w-[200px] mx-auto lg:mx-0"
				}
			>
				{renderPhotoStrip()}
			</div>

			<div className="flex flex-col flex-1 max-w-md gap-6">
				<div>
					<h2 className="text-xl font-semibold mb-4">Choose Frame</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{PHOTO_STRIP_TEMPLATES.map((t) => {
							let buttonStyle = {}
							let textStyle = "text-sm"

							if (t.id === "wave-to-earth") {
								buttonStyle = {
									background: template.id === t.id ? "#F2F0F1" : "",
									border:
										template.id === t.id
											? "2px solid #9CA3AF"
											: "1px solid #9CA3AF",
									color: template.id === t.id ? "#333333" : "",
									fontFamily: "'Quicksand', sans-serif",
									borderRadius: "6px",
								}
							} else if (t.id === "NJZ") {
								buttonStyle = {
									background: template.id === t.id ? "#ffffff" : "",
									border:
										template.id === t.id
											? "2px solid #9CA3AF"
											: "1px solid #9CA3AF",
									color: template.id === t.id ? "#3B82F6" : "",
									fontFamily: "'Jersey 10', sans-serif",
									fontSize: "1.1rem",
									borderRadius: "6px",
								}
							} else if (t.id === "Niki Backburner" || t.id === "Niki Paths") {
								buttonStyle = {
									background:
										template.id === t.id
											? t.id === "Niki Paths"
												? "#000000"
												: "#ffffff"
											: "",
									border:
										template.id === t.id
											? "2px solid #9CA3AF"
											: "1px solid #9CA3AF",
									color:
										template.id === t.id
											? t.id === "Niki Paths"
												? "#ffffff"
												: "#3367EB"
											: "",
									fontFamily: "'Daniel', cursive",
									borderRadius: "4px",
								}
							} else {
								buttonStyle = {
									border:
										template.id === t.id
											? "2px solid #9CA3AF"
											: "1px solid #e5e7eb",
									borderRadius: "6px",
								}
							}

							return (
								<Button
									key={t.id}
									variant={template.id === t.id ? "default" : "outline"}
									onClick={() => handleTemplateChange(t)}
									className={`w-full ${textStyle} ${
										template.id === t.id
											? t.id === "wave-to-earth" ||
											  t.id === "NJZ" ||
											  t.id.includes("Niki")
												? ""
												: "bg-black text-white"
											: "hover:bg-black/5"
									}`}
									style={buttonStyle}
								>
									{t.name}
								</Button>
							)
						})}
					</div>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-4">Download Quality</h2>
					<div className="grid grid-cols-2 gap-2 mb-6">
						<Button
							variant={quality === "standard" ? "default" : "outline"}
							onClick={() => setQuality("standard")}
							className={`w-full ${
								quality === "standard"
									? "bg-black text-white"
									: "hover:bg-black/5"
							}`}
						>
							Standard (2x)
						</Button>
						<Button
							variant={quality === "high" ? "default" : "outline"}
							onClick={() => setQuality("high")}
							className={`w-full ${
								quality === "high" ? "bg-black text-white" : "hover:bg-black/5"
							}`}
						>
							High Quality (4x)
						</Button>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
							className="w-full hover:bg-black/5"
						>
							Take New Photos
						</Button>
						<Button
							onClick={handleDownload}
							className="w-full bg-black text-white hover:bg-black/90"
						>
							Download
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
