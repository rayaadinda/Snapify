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
				"absolute bottom-4 left-0 right-0 text-center font-['Daniel']  text-black text-xl",
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
				"absolute bottom-4 left-0 right-0 text-center font-['Daniel']  text-white text-xl",
			],
			decorationContent: ["Snapify"],
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
				"absolute bottom-4 left-0 right-0 text-center font-['VT323'] text-white text-2xl tracking-wider",
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
				"absolute bottom-4 left-0 right-0 text-center font-['Quicksand'] font-medium text-[#FF4D79] text-xl",
			],
			decorationContent: ["", "", "", "Snapify"],
		},
	},
	{
		id: "cyber",
		name: "Cyber Pop",
		background: "neon",
		styles: {
			container:
				"bg-black p-2 w-[200px] pb-20 relative overflow-hidden border-[2px] border-[#00ff9d] shadow-lg",
			photo:
				"rounded-none mb-2 relative z-10 border-[1px] border-[#00ff9d] shadow-[0_0_8px_#00ff9d]",
			background: "#000000",
			decorations: [
				"absolute top-0 left-0 w-full h-full bg-[url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%2300ff9d' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")] opacity-30",
				"absolute bottom-4 left-0 right-0 text-center font-['Orbitron'] text-[#00ff9d] text-xl tracking-widest shadow-[0_0_8px_#00ff9d]",
			],
			decorationContent: ["", "Snapify"],
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
				"absolute bottom-4 left-0 right-0 text-center font-['Mochiy_Pop_One'] text-pink-500 text-xl",
			],
			decorationContent: ["🌸", "⭐️", "🎀", "💫", "Snapify"],
		},
	},
]
