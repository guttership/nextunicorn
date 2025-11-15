const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleIdeas = [
  {
    title: "AI-Powered Email Summarizer",
    slogan: "Never miss an important email again",
    description: "An AI tool that automatically summarizes and categorizes your emails, highlighting the most important information",
    aiPromptId: "email_summarizer_1",
    aiPrompt: "Imagine drowning in emails every day. What if there was a smart assistant that reads them all for you and only shows you what matters?"
  },
  {
    title: "Code Quality Dashboard",
    slogan: "One view of all your code health",
    description: "Real-time dashboard for monitoring code quality metrics across all repositories with AI-powered insights",
    aiPromptId: "code_quality_1",
    aiPrompt: "Picture a health dashboard for your software - showing at a glance if your codebase is healthy, broken, or needs a workout"
  },
  {
    title: "API Analytics Platform",
    slogan: "Understand your APIs better",
    description: "Comprehensive analytics platform for monitoring, debugging, and optimizing API performance",
    aiPromptId: "api_analytics_1",
    aiPrompt: "What if you could see exactly how your software services are performing, like a fitness tracker for your API endpoints?"
  },
  {
    title: "Automated Testing Framework",
    slogan: "Smart test generation at scale",
    description: "AI-powered framework that automatically generates comprehensive test cases from your code",
    aiPromptId: "testing_framework_1",
    aiPrompt: "Imagine a robot that tests your software for bugs automatically - catching problems before real users do"
  },
  {
    title: "Document OCR Service",
    slogan: "Turn paper into data instantly",
    description: "Cloud-based OCR service that extracts and structures data from documents with high accuracy",
    aiPromptId: "ocr_service_1",
    aiPrompt: "Picture scanning a stack of papers and instantly turning them into searchable, organized digital files"
  },
  {
    title: "Real-time Log Analyzer",
    slogan: "Find issues before they become problems",
    description: "Real-time log aggregation and analysis with anomaly detection for distributed systems",
    aiPromptId: "log_analyzer_1",
    aiPrompt: "What if your system could warn you about problems the moment something strange happens - before users notice?"
  },
  {
    title: "Database Optimization Advisor",
    slogan: "Your database's personal trainer",
    description: "AI advisor that analyzes your database queries and suggests optimizations",
    aiPromptId: "db_optimizer_1",
    aiPrompt: "Imagine having a coach that teaches your database to run faster and use less energy, like training for a race"
  },
  {
    title: "Deployment Safety Net",
    slogan: "Deploy with confidence",
    description: "Automated system for detecting and rolling back problematic deployments automatically",
    aiPromptId: "deployment_safety_1",
    aiPrompt: "Picture a safety net that catches bad updates and automatically fixes them before users are affected"
  },
  {
    title: "Customer Data Platform",
    slogan: "Unified customer view, unified action",
    description: "CDP solution that unifies customer data across sources and enables real-time personalization",
    aiPromptId: "cdp_1",
    aiPrompt: "Imagine knowing everything about your customers across all channels - like seeing their entire story in one place"
  },
  {
    title: "Compliance Automation Engine",
    slogan: "Stay compliant, always",
    description: "Automated compliance monitoring and reporting for SOC 2, GDPR, and other regulations",
    aiPromptId: "compliance_1",
    aiPrompt: "What if keeping your business compliant with laws was automatic instead of a constant headache?"
  }
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create ideas for today
    for (const idea of sampleIdeas) {
      await prisma.idea.create({
        data: {
          ...idea,
          generatedAt: today,
          isDaily: true,
          score: 0
        }
      });
    }
    
    console.log("✅ Database seeded successfully!");
    console.log(`📊 Created ${sampleIdeas.length} ideas for today`);
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
