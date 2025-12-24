import React from 'react';
import type { View } from '../types';

interface BlogDetailPageProps {
    postId: number;
    blog: any;
    setView: (view: View) => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ postId, blog, setView }) => {

    if (!blog) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-2xl font-bold">Post not found</h2>
                <button 
                    onClick={() => setView({ page: 'blog' })} 
                    className="mt-4 px-6 py-3 bg-[--primary-medium] text-white font-semibold rounded-lg shadow-md hover:bg-[--primary-dark]"
                >
                    Back to Blog
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white">
            {/* Header Image */}
            <div className="relative h-96 mt-24">
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[--primary-dark]/70 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{blog.title}</h1>
                        <p className="mt-4 text-lg">{blog.author} • {blog.date}</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
                <button 
                    onClick={() => setView({ page: 'blog' })} 
                    className="mb-8 font-semibold text-[--primary-medium] hover:underline"
                >
                    ← Back to all articles
                </button>

                <article 
                    className="prose lg:prose-xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
        </div>
    );
};

export default BlogDetailPage;
