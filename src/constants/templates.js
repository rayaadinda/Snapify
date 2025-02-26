import wteFrame from "@/assets/wte.png"
import njzFrame from "@/assets/NJZ.png"

export const PHOTO_STRIP_TEMPLATES = [
	{
		id: "classic",
		name: "Classic",
		background: "white",
		styles: {
			container: "bg-white p-2 w-[200px] pb-20 shadow-lg relative",
			photo: "rounded-none mb-2",
			background: "#ffffff",
			decorations: [
				"absolute bottom-8 left-0 right-0 text-center font-['Daniel']  text-black text-xl",
			],
			decorationContent: ["Snapify"],
		},
	},
	{
		id: "black",
		name: "Black",
		background: "black",
		styles: {
			container: "bg-black p-2 w-[200px] pb-20 shadow-lg relative",
			photo: "rounded-none mb-2",
			background: "#1E1E1E",
			decorations: [
				"absolute bottom-8 left-0 right-0 text-center font-['Daniel']  text-white text-xl",
			],
			decorationContent: ["Snapify"],
		},
	},
	{
		id: "Niki Backburner",
		name: "Niki Backburner",
		background: "white",
		styles: {
			container: "bg-white p-2 w-[200px] pb-20 shadow-lg relative",
			photo: "rounded-none mb-2",
			background: "#ffffff",
			decorations: [
				"absolute bottom-2 p-2 text-right font-['Daniel']  text-[#3367EB] text-sm whitespace-pre-line",
			],
			decorationContent: ["hey are you still there?\nGood"],
		},
	},
	{
		id: "Niki Paths",
		name: "Niki Paths",
		background: "white",
		styles: {
			container: "bg-black p-2 w-[200px] pb-20 shadow-lg relative",
			photo: "rounded-none mb-2",
			background: "#000000",
			decorations: [
				"absolute bottom-2 p-2 text-center font-['Daniel']  text-white text-sm",
			],
			decorationContent: ["I hope our paths cross again"],
		},
	},
	{
		id: "wave-to-earth",
		name: "Wave to Earth",
		background: "#F2F0F1",
		styles: {
			container:
				"bg-[#F2F0F1] p-2 w-[200px] pb-20 shadow-lg relative flex flex-col",
			photo: "rounded-none mb-2",
			background: "#F2F0F1",
			decorations: [
				"absolute bottom-0 left-0 w-full flex justify-center items-end px-2",
			],
			decorationContent: [""],
			frameImage: wteFrame,
		},
	},
	{
		id: "NJZ",
		name: "NJZ",
		background: "#ffffff",
		styles: {
			container:
				"bg-[#ffffff] p-2 w-[200px] pb-20 shadow-lg relative flex flex-col",
			photo: "rounded-none mb-2",
			background: "#ffffff",
			decorations: [
				"absolute bottom-0 left-0 w-full flex justify-center items-end px-4",
			],
			decorationContent: [""],
			frameImage: njzFrame,
		},
	},
	{
		id: "y2k",
		name: "Y2K Vibes",
		background: "gradient",
		styles: {
			container:
				"bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-400 p-2 w-[200px] pb-20 relative overflow-hidden shadow-lg",
			photo: "rounded-none mb-2 relative z-10",
			background: "#f0abfc",
			decorations: [
				"absolute top-4 right-4 text-xl",
				"absolute bottom-20 left-3 text-xl rotate-[-10deg]",
				"absolute bottom-12 right-3 text-lg rotate-[15deg]",
				"absolute bottom-8 left-0 right-0 text-center font-['VT323'] text-white text-2xl tracking-wider",
			],
			decorationContent: ["✨", "🦋", "💖", "Snapify"],
		},
	},
	{
		id: "aesthetic",
		name: "Aesthetic",
		background: "pattern",
		styles: {
			container:
				"bg-[#FFD4E5] p-2 w-[200px] pb-20 relative overflow-hidden shadow-lg",
			photo: "rounded-none mb-2 relative z-10",
			background: "#FFD4E5",
			decorations: [
				"absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#FFA6C1] opacity-50",
				"absolute top-1/3 -left-8 w-12 h-12 rounded-full bg-[#FF8AAB] opacity-50",
				"absolute bottom-12 -right-4 w-16 h-16 rounded-full bg-[#FF6B95] opacity-50",
				"absolute bottom-8 left-0 right-0 text-center font-['Quicksand'] font-medium text-[#FF4D79] text-xl",
			],
			decorationContent: ["", "", "", "Snapify"],
		},
	},
	{
		id: "kawaii",
		name: "Kawaii",
		background: "cute",
		styles: {
			container:
				"bg-gradient-to-b from-[#FFF5F5] to-[#FFE0E0] p-2 w-[200px] pb-20 relative overflow-hidden shadow-lg",
			photo: "rounded-none mb-2 relative z-10",
			background: "#FFF5F5",
			decorations: [
				"absolute top-3 right-3 text-lg transform rotate-[15deg]",
				"absolute bottom-20 left-2 text-lg transform -rotate-[10deg]",
				"absolute bottom-12 right-3 text-lg",
				"absolute top-1/3 left-2 text-lg transform rotate-[5deg]",
				"absolute bottom-8 left-0 right-0 text-center font-['Mochiy_Pop_One'] text-pink-500 text-xl",
			],
			decorationContent: ["🌸", "⭐️", "🎀", "💫", "Snapify"],
		},
	},
]
