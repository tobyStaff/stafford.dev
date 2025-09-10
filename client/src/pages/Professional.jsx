import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  StarIcon,
  WrenchScrewdriverIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'

const Professional = () => {
  const contentRef = useRef()
  const [isExporting, setIsExporting] = useState(false)
  const [isPdfMode, setIsPdfMode] = useState(false)

  const exportToText = () => {
    let text = 'TOBY STAFFORD - PROFESSIONAL EXPERIENCE\n'
    text += '=' + '='.repeat(47) + '\n\n'
    text += 'Senior Development Manager | Frontend Platform & Design Systems\n\n'
    
    text += 'WORK EXPERIENCE\n'
    text += '-'.repeat(15) + '\n\n'
    
    experiences.forEach(exp => {
      text += `${exp.position}\n`
      text += `${exp.company} | ${exp.location}\n`
      text += `${exp.duration}\n\n`
      text += `${exp.description}\n\n`
      
      if (exp.highlights) {
        text += 'Key Highlights:\n'
        exp.highlights.forEach(highlight => {
          text += `• ${highlight}\n`
        })
        text += '\n'
      }
      
      text += 'Technologies: ' + exp.technologies.join(', ') + '\n\n'
      text += '-'.repeat(80) + '\n\n'
    })
    
    text += 'EDUCATION\n'
    text += '-'.repeat(9) + '\n\n'
    
    education.forEach(edu => {
      text += `${edu.degree}\n`
      text += `${edu.school} | ${edu.location}\n`
      text += `${edu.duration}\n\n`
      text += `${edu.description}\n\n`
    })
    
    text += 'CORE SKILLS\n'
    text += '-'.repeat(11) + '\n\n'
    text += skills.join(' • ') + '\n\n'
    
    text += 'KEY ACHIEVEMENTS\n'
    text += '-'.repeat(16) + '\n\n'
    
    achievements.forEach(achievement => {
      text += `${achievement.title}\n`
      text += `${achievement.description}\n\n`
    })
    
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Toby_Stafford_Professional_CV.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToMarkdown = () => {
    let md = '# Toby Stafford - Professional Experience\n\n'
    md += '*Senior Development Manager | Frontend Platform & Design Systems*\n\n'
    
    md += '## Work Experience\n\n'
    
    experiences.forEach(exp => {
      md += `### ${exp.position}\n`
      md += `**${exp.company}** | ${exp.location}  \n`
      md += `*${exp.duration}*\n\n`
      md += `${exp.description}\n\n`
      
      if (exp.highlights) {
        md += '**Key Highlights:**\n'
        exp.highlights.forEach(highlight => {
          md += `- ${highlight}\n`
        })
        md += '\n'
      }
      
      md += '**Technologies:** ' + exp.technologies.map(tech => `\`${tech}\``).join(', ') + '\n\n'
      md += '---\n\n'
    })
    
    md += '## Education\n\n'
    
    education.forEach(edu => {
      md += `### ${edu.degree}\n`
      md += `**${edu.school}** | ${edu.location}  \n`
      md += `*${edu.duration}*\n\n`
      md += `${edu.description}\n\n`
    })
    
    md += '## Core Skills\n\n'
    md += skills.map(skill => `- ${skill}`).join('\n') + '\n\n'
    
    md += '## Key Achievements\n\n'
    
    achievements.forEach(achievement => {
      md += `### ${achievement.title}\n`
      md += `${achievement.description}\n\n`
    })
    
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Toby_Stafford_Professional_CV.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async () => {
    const element = contentRef.current
    
    if (!element) {
      console.error('Content element not found for PDF export')
      return
    }

    setIsExporting(true)
    setIsPdfMode(true)

    try {
      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Dynamically import html2pdf to reduce bundle size
      const html2pdf = (await import('html2pdf.js')).default
      
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: 'Toby_Stafford_Professional_CV.pdf',
        image: { 
          type: 'jpeg', 
          quality: 0.95
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          letterRendering: true,
          logging: false,
          windowWidth: 1024,
          windowHeight: element.scrollHeight
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css']
        }
      }
      
      await html2pdf().set(opt).from(element).save()
      
    } catch (error) {
      console.error('PDF export failed:', error)
      alert(`PDF export failed: ${error.message}. Please try again.`)
    } finally {
      setIsExporting(false)
      setIsPdfMode(false)
    }
  }

  const experiences = [
    {
      company: "SureCloud",
      position: "Senior Development Manager - Frontend Platform & Design Systems",
      location: "Remote, UK",
      duration: "June 2023 - Present",
      description: "Lead and manage frontend platform and design systems development for Enterprise B2B SaaS Platform. Responsible for continuous process improvement for a team of 30+ engineers, reporting directly to CTO and working closely with CPO & other C-Suite executives.",
      technologies: ["JavaScript", "TypeScript", "Angular", "Redux", "NgRx", "RxJS", "Design Systems", "Team Leadership"],
      highlights: [
        "Leading team of 30+ engineers with direct CTO reporting",
        "Driving frontend platform and design systems strategy",
        "Implementing continuous process improvement initiatives",
        "Managing complex stakeholder relationships at C-Suite level"
      ]
    },
    {
      company: "SureCloud",
      position: "UI Development Manager",
      location: "Remote, UK", 
      duration: "October 2021 - June 2023",
      description: "Recruited and supported a team of 10 specialized frontend engineers. Rebuilt legacy systems implementing modern best practices and methodologies. Delivered greenfield software platform for multi-million pound project while continuously improving development processes.",
      technologies: ["Angular", "TypeScript", "Modern Frontend Practices", "Team Building", "Legacy System Migration"],
      highlights: [
        "Recruited and built team of 10 specialized frontend engineers",
        "Delivered multi-million pound greenfield software platform",
        "Successfully rebuilt legacy systems with modern best practices",
        "Established scalable development processes and practices"
      ]
    },
    {
      company: "SureCloud",
      position: "Senior UI Developer",
      location: "Remote, UK",
      duration: "May 2021 - October 2021", 
      description: "Introduced frontend specialization at SureCloud, establishing modern frontend development patterns and practices. Contributed to architectural decisions for new platform development and laid the foundation for frontend team expansion.",
      technologies: ["Angular", "TypeScript", "Frontend Architecture", "Modern Development Practices"],
      highlights: [
        "Introduced frontend specialization to the organization",
        "Established modern frontend development patterns",
        "Contributed to platform architectural decisions",
        "Set foundation for team scaling and growth"
      ]
    },
    {
      company: "Atomus Limited",
      position: "Front End Web Developer",
      location: "Farnham, Surrey, UK",
      duration: "January 2017 - May 2021",
      description: "Developed web applications using Angular 2, TypeScript, ES6 & Redux. Implemented responsive, performant user interfaces for complex applications and collaborated with back-end developers to integrate frontend solutions with APIs.",
      technologies: ["Angular 2+", "TypeScript", "ES6", "Redux", "Responsive Design", "API Integration"],
      highlights: [
        "Built complex web applications with modern frameworks",
        "Delivered responsive and performant user interfaces", 
        "Successfully integrated frontend solutions with backend APIs",
        "Maintained high code quality and performance standards"
      ]
    },
    {
      company: "AJW Group",
      position: "Web Developer", 
      location: "Slinfold, West Sussex, UK",
      duration: "September 2015 - January 2017",
      description: "Collected user stories and designed/delivered frontend SPA solutions using modern frameworks. Collaborated with back-end developers and created Node APIs to utilize data resources. Delivered data-driven software solving bespoke business problems requiring graphs, charts, maps, and SVG layouts.",
      technologies: ["JavaScript", "Angular", "Node.js", "CSS3", "SASS", "Data Visualization", "SVG", "Unit Testing"],
      highlights: [
        "Delivered bespoke business solutions with complex data visualization",
        "Created full-stack solutions including Node APIs",
        "Implemented interactive graphs, charts, maps and SVG layouts",
        "Successfully gathered requirements and delivered user-focused solutions"
      ]
    },
    {
      company: "Addison-Group",
      position: "Web Developer",
      location: "London Bridge, London, UK", 
      duration: "October 2014 - September 2015",
      description: "Built and maintained frontends for various external clients and internal applications. Implemented solutions using HTML, CSS, jQuery, XML, XSL while ensuring web standards compliance, accessibility, and cross-browser compatibility.",
      technologies: ["HTML", "CSS", "jQuery", "JavaScript", "XML", "XSL", "Node.js", "NPM", "Git", "Bower"],
      highlights: [
        "Delivered frontend solutions for multiple external clients",
        "Ensured web standards compliance and accessibility",
        "Maintained cross-browser compatibility across projects",
        "Established modern development workflows and tooling"
      ]
    },
    {
      company: "Just Add Art",
      position: "Front-End Web Developer",
      location: "South West London, UK",
      duration: "August 2014 - October 2014", 
      description: "Reshaped and refactored existing website for mobile platforms. Implemented responsive web design using HTML, CSS, JavaScript with light PHP, utilizing frameworks including Bootstrap, jQuery, and SASS.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "Bootstrap", "jQuery", "SASS", "Responsive Design"],
      highlights: [
        "Successfully refactored website for mobile responsiveness",
        "Implemented modern responsive design principles",
        "Utilized contemporary frontend frameworks and tools",
        "Applied progressive enhancement and cross-browser compatibility"
      ]
    },
    {
      company: "Sky",
      position: "Data Administrator",
      location: "West London, UK",
      duration: "September 2011 - January 2014",
      description: "Managed and maintained data systems and administrative processes. Gained valuable experience in data management and system administration that later informed technical development approaches.",
      technologies: ["Data Management", "System Administration", "Process Management"],
      highlights: [
        "Managed complex data systems and processes",
        "Developed strong analytical and problem-solving skills",
        "Built foundation for technical career transition",
        "Established attention to detail and process-oriented mindset"
      ]
    },
    {
      company: "Chapman Entertainment Ltd",
      position: "Animation Coordinator",
      location: "South West London, UK", 
      duration: "November 2007 - September 2011",
      description: "Coordinated animation production processes for children's television content. Managed project timelines, collaborated with creative teams, and ensured quality delivery of animated content for major broadcasters.",
      technologies: ["Animation Production", "Project Coordination", "Creative Collaboration", "Broadcasting"],
      highlights: [
        "Coordinated production for major children's television content",
        "Managed complex project timelines and creative workflows",
        "Collaborated with diverse creative and technical teams", 
        "Delivered high-quality content for major broadcasters"
      ]
    },
  ]

  const education = [
    {
      school: "Ravensbourne College of Design and Communication",
      degree: "BA (HONS) Content for Broadcasting and New Media",
      location: "London, UK",
      duration: "2005 - 2007",
      description: "Specialized in content creation for broadcasting and new media platforms. Gained comprehensive understanding of digital media production, content strategy, and emerging technologies in the media landscape.",
    },
  ]

  const skills = [
    "JavaScript",
    "TypeScript", 
    "Angular",
    "React",
    "Redux/NgRx",
    "HTML5/CSS3",
    "SASS/SCSS",
    "Node.js",
    "Design Systems",
    "Team Leadership",
    "Frontend Architecture",
    "Performance Optimization",
    "CI/CD",
    "Testing (Jest/Cypress)",
    "Accessibility",
    "Responsive Design"
  ]

  const achievements = [
    {
      title: "Frontend Specialization Leadership",
      description: "Successfully introduced and scaled frontend specialization at SureCloud, growing from individual contributor to leading 30+ engineers across multiple teams and projects.",
    },
    {
      title: "Multi-Million Pound Project Delivery",
      description: "Led delivery of greenfield software platform for multi-million pound project while building and scaling specialized frontend engineering team from ground up.",
    },
    {
      title: "Legacy System Modernization",
      description: "Successfully rebuilt legacy systems implementing modern best practices, establishing scalable development processes and significantly improving code quality and maintainability.",
    },
    {
      title: "Technical Leadership & Mentorship",
      description: "Recruited, developed and mentored high-performing frontend engineering teams, establishing standards for technical quality, communication, and delivery processes.",
    },
  ]

  return (
    <>
      <style>{`
        .pdf-mode {
          background-color: white !important;
          color: black !important;
        }
        
        .pdf-mode * {
          background-color: transparent !important;
          border-color: #ddd !important;
          color: black !important;
        }
        
        .pdf-mode .bg-primary-900,
        .pdf-mode .bg-primary-800 {
          background-color: white !important;
          border: 1px solid #e5e5e5 !important;
        }
        
        .pdf-mode .bg-primary-800 {
          background-color: #f9f9f9 !important;
          padding: 16px !important;
          margin-bottom: 12px !important;
          border-radius: 6px !important;
        }
        
        .pdf-mode .text-white,
        .pdf-mode .text-gray-300 {
          color: #333 !important;
        }
        
        .pdf-mode .text-purple-400,
        .pdf-mode .text-purple-300 {
          color: #666 !important;
          font-weight: 600 !important;
        }
        
        .pdf-mode h1 {
          color: #000 !important;
          font-size: 28px !important;
          margin-bottom: 16px !important;
        }
        
        .pdf-mode h2 {
          color: #000 !important;
          font-size: 20px !important;
          margin-bottom: 12px !important;
          margin-top: 24px !important;
          border-bottom: 2px solid #333 !important;
          padding-bottom: 4px !important;
        }
        
        .pdf-mode h3 {
          color: #000 !important;
          font-size: 16px !important;
          margin-bottom: 8px !important;
        }
        
        .pdf-mode h4 {
          color: #000 !important;
          font-size: 14px !important;
          margin-bottom: 6px !important;
        }
        
        .pdf-mode p,
        .pdf-mode li {
          color: #333 !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
          margin-bottom: 6px !important;
        }
        
        .pdf-mode svg {
          color: #666 !important;
        }
        
        .pdf-mode .bg-purple-600 {
          background-color: #e5e5e5 !important;
          border: 1px solid #ccc !important;
        }
        
        .pdf-mode .border-primary-700 {
          border-color: #ddd !important;
        }
        
        .pdf-mode .page-break-avoid {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .pdf-mode .hero-section {
          display: none !important;
        }
      `}</style>
      <div className={`bg-primary-900 min-h-screen ${isPdfMode ? 'pdf-mode' : ''}`}>
      {/* Hero Section */}
      <div className="relative bg-primary-800 hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Professional{' '}
            <span className="text-purple-400">Experience</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A comprehensive overview of my career journey, education, and professional achievements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={exportToText}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export as Text
            </button>
            <button
              onClick={exportToMarkdown}
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              Export as Markdown
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
              {isExporting ? 'Generating PDF...' : 'Export to PDF'}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <svg
            className="w-full h-6 text-primary-900"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M1200 120L0 16.48V120z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* PDF Header - only visible in PDF mode */}
        {isPdfMode && (
          <div className="mb-8 text-center border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold text-black mb-2">
              Toby Stafford - Professional Experience
            </h1>
            <p className="text-gray-600">
              Senior Development Manager | Frontend Platform & Design Systems
            </p>
          </div>
        )}
        {/* Work Experience Section */}
        <section className="mb-16 page-break-avoid">
          <div className="flex items-center mb-8">
            <BriefcaseIcon className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Work Experience</h2>
          </div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-primary-800 border border-primary-700 rounded-lg p-6 page-break-avoid mb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{exp.position}</h3>
                    <div className="flex items-center text-purple-400 mb-2">
                      <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-300 text-sm mb-3 gap-2">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{exp.description}</p>
                
                {exp.highlights && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Highlights:</h4>
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="flex items-start text-gray-300 text-sm">
                          <StarIcon className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-purple-600 bg-opacity-20 text-purple-300 text-sm rounded-full border border-purple-500 border-opacity-30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-16 page-break-avoid">
          <div className="flex items-center mb-8">
            <AcademicCapIcon className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Education</h2>
          </div>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="bg-primary-800 border border-primary-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-1">{edu.degree}</h3>
                <div className="flex items-center text-purple-400 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                  <span className="font-medium">{edu.school}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-300 text-sm mb-3 gap-2">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{edu.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{edu.location}</span>
                  </div>
                </div>
                <p className="text-gray-300">{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16 page-break-avoid">
          <div className="flex items-center mb-8">
            <WrenchScrewdriverIcon className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Core Skills</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-primary-800 border border-primary-700 rounded-lg p-4 text-center">
                <span className="text-white font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="page-break-avoid">
          <div className="flex items-center mb-8">
            <TrophyIcon className="w-8 h-8 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Key Achievements</h2>
          </div>
          
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-primary-800 border border-primary-700 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{achievement.title}</h3>
                <p className="text-gray-300">{achievement.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  )
}

export default Professional