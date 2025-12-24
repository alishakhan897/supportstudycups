import React from "react";

// Social Icon SVGs for a cleaner look (using common icons)
const SocialIcon = ({ children }) => (
    <a
        href="#"
        className="text-white/70 hover:text-white transition-colors duration-200"
        aria-label="Social Link"
    >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            {children}
        </svg>
    </a>
);


const Footer: React.FC = () => {
    // Consolidated and reorganized sections for a better structure
    const linkSections = {
        "QUICK LINKS": [
            { name: "Colleges", href: "#" },
            { name: "Courses", href: "#" },
            { name: "Exams", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Compare", href: "#" },
        ],
        "POPULAR EXAMS": ["JEE Main", "NEET", "CAT", "GATE", "UPSC"],
        "HELP & SUPPORT": [
            { name: "Contact Us", href: "#" },
            { name: "Counselling", href: "#" },
            { name: "Terms & Conditions", href: "#" },
            { name: "Privacy Policy", href: "#" },
            { name: "Sitemap", href: "#" },
        ],
    };

    return (
        // Removed the outer pt-16/pb-20 padding and used the deep blue background directly for the footer
        <footer className="bg-[#0A2A6C] text-white pt-10 pb-4 w-90% mx-auto mt-10 rounded-t-3xl mb-8">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main Content Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-8 pb-10 border-b border-white/20">

                    {/* Column 1: Logo, About, Contact, Newsletter */}
                    <div className="col-span-2 space-y-5 pr-4">

                        {/* Logo/Name (Using the logo from the provided images) */}
                        <div className="flex items-center space-x-2">
                            <img
                                src="/logos/StudyCups.png"// Placeholder for StudyCups Logo (image_afa9d9.png)
                                alt="StudyCups Education Logo"
                                className="h-10 w-auto"
                            />
                         
                        </div>

                        <p className="text-white/80 leading-relaxed text-sm max-w-sm">
                            Your one-stop destination for finding the perfect college and course to shape your future.
                        </p>

                        <p className="text-white/80 text-sm">
                            <span className="font-semibold">Contact:</span> +91 8081269969
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-4 pt-2">
                            <SocialIcon><path d="M22.232 4.017c-.722.321-1.498.536-2.311.637.83-.5-1.498.817-1.794.817-2.348 0-4.254 1.906-4.254 4.254 0 .334.039.658.114.969-3.535-.178-6.666-1.87-8.763-4.444-.367.63-.578 1.362-.578 2.146 0 1.479.753 2.78 1.897 3.546-.7-.023-1.355-.213-1.928-.53-.001.018-.001.036-.001.054 0 2.067 1.471 3.791 3.42 4.187-.358.098-.737.151-1.127.151-.276 0-.543-.026-.803-.076.542 1.696 2.112 2.937 3.978 2.971-1.455 1.139-3.29 1.821-5.28 1.821-.343 0-.683-.021-1.015-.062 1.882 1.206 4.103 1.904 6.495 1.904C16.897 20.999 21.056 16.84 21.056 9.479c0-.144-.003-.287-.008-.429.988-.714 1.844-1.603 2.525-2.613z" /></SocialIcon>
                            <SocialIcon><path d="M7.747 18.006c-3.13 0-5.666-2.536-5.666-5.667 0-3.13 2.536-5.667 5.666-5.667 3.13 0 5.667 2.537 5.667 5.667 0 3.13-2.537 5.667-5.667 5.667zm6.756-.732c-.173.34-.337.66-.49.957-.492.93-1.218 1.696-2.09 2.195-2.227 1.298-5.32 1.298-7.548 0-.872-.5-1.598-1.265-2.09-2.195-.153-.297-.317-.617-.49-.957h12.71z" /></SocialIcon>
                            <SocialIcon><path d="M20.211 2h-16.422c-1.096 0-1.99.894-1.99 1.99v16.02c0 1.096.894 1.99 1.99 1.99h16.422c1.096 0 1.99-.894 1.99-1.99V3.99c0-1.096-.894-1.99-1.99-1.99zm-13.435 15.114h-2.924v-9.337h2.924v9.337zm4.512 0h-2.925v-9.337h2.925v9.337zm4.512 0h-2.925v-9.337h2.925v9.337zm4.512 0h-2.925v-9.337h2.925v9.337z" /></SocialIcon>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4 text-sm">
                        <h3 className="font-bold text-white tracking-wider text-base">QUICK LINKS</h3>
                        <ul className="space-y-2">
                            {linkSections["QUICK LINKS"].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-white/70 hover:text-white transition duration-200 text-[15px]">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Exams */}
                    <div className="space-y-4 text-sm">
                        <h3 className="font-bold text-white tracking-wider text-base">POPULAR EXAMS</h3>
                        <ul className="space-y-2">
                            {linkSections["POPULAR EXAMS"].map((exam) => (
                                <li key={exam}>
                                    <a href="#" className="text-white/70 hover:text-white transition duration-200 text-[15px]">
                                        {exam}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Help & Support */}
                    <div className="space-y-4 text-sm">
                        <h3 className="font-bold text-white tracking-wider text-base">HELP & SUPPORT</h3>
                        <ul className="space-y-2">
                            {linkSections["HELP & SUPPORT"].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-white/70 hover:text-white transition duration-200 text-[15px]">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Copyright Section (Lower Height) */}
                <div className="
                    mt-4 pt-4 
                    flex flex-col md:flex-row 
                    justify-between items-center 
                    text-white/70 text-xs 
                ">
                    <p className="order-2 md:order-1 mt-3 md:mt-0">
                        © {new Date().getFullYear()} StudyCups Education. All Rights Reserved.
                    </p>

                    {/* Simplified Policy Links */}
                    <div className="order-1 md:order-2 flex space-x-4">
                        <a href="#" className="hover:text-white transition duration-200">Terms of Use</a>
                        <a href="#" className="hover:text-white transition duration-200">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;