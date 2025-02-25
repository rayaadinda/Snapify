import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import { motion } from "framer-motion"
import { PHOTO_STRIP_TEMPLATES } from "@/constants/templates"

export const Preview = ({ photos, template: initialTemplate }) => {
	const stripRef = useRef(null)
	const [template, setTemplate] = useState(initialTemplate)
	const [quality, setQuality] = useState("high") // 'standard' or 'high'

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

	const handleDownload = async () => {
		if (!stripRef.current) return

		try {
			const canvas = await html2canvas(stripRef.current, {
				backgroundColor: template.styles.background,
				scale: qualityOptions[quality].scale,
				useCORS: true,
				logging: false,
				allowTaint: true,
				imageTimeout: 0,
			})

			const link = document.createElement("a")
			link.download = `Snapify-${quality}-quality.png`
			link.href = canvas.toDataURL(
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

		return template.styles.decorations.map((decoration, index) => (
			<div key={index} className={decoration}>
				{template.styles.decorationContent?.[index] || ""}
			</div>
		))
	}

	return (
		<div className="flex flex-col lg:flex-row items-start justify-center w-full max-w-3xl mx-auto p-4 gap-8">
			<div className="w-[200px] mx-auto lg:mx-0">
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
			</div>

			<div className="flex flex-col flex-1 max-w-md gap-6">
				<div>
					<h2 className="text-xl font-semibold mb-4">Choose Frame</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{PHOTO_STRIP_TEMPLATES.map((t) => (
							<Button
								key={t.id}
								variant={template.id === t.id ? "default" : "outline"}
								onClick={() => handleTemplateChange(t)}
								className={`w-full text-sm ${
									template.id === t.id
										? "bg-black text-white"
										: "hover:bg-black/5"
								}`}
							>
								{t.name}
							</Button>
						))}
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
