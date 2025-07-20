import '../src/index.css'

export const metadata = {
  title: 'Minh-Khoi Pham - AI Researcher & Ph.D. Student',
  description: 'Portfolio of Minh-Khoi Pham (Kay) - AI Researcher, Ph.D. Student at Dublin City University, specializing in machine learning and computer vision.',
  keywords: 'AI, Machine Learning, Computer Vision, Research, Ph.D., Portfolio',
  author: 'Minh-Khoi Pham',
  openGraph: {
    title: 'Minh-Khoi Pham - AI Researcher & Ph.D. Student',
    description: 'Portfolio showcasing AI research, projects, and academic work',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
