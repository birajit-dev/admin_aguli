'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <header className="w-full max-w-7xl mx-auto text-center py-24 px-4 relative">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-gradient-x">
          ML Pipeline Platform
        </h1>
        <p className="mt-8 text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
          Build, deploy, and scale machine learning pipelines with our enterprise-grade platform. From data ingestion to model deployment - all in one place.
        </p>
        <div className="mt-12 flex justify-center gap-6">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-200 text-lg px-8">
            <Link href="/signup">
              Start Free Trial
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-2 hover:bg-gray-800/30 shadow-xl backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-200 text-lg px-8">
            <Link href="/demo">
              Request Demo
            </Link>
          </Button>
        </div>
      </header>

      <section className="w-full max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 border-0 group">
            <CardContent className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Image src="/icons/pipeline.svg" alt="Pipeline" width={32} height={32} className="text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Visual Pipeline Builder</CardTitle>
              <p className="text-gray-300 leading-relaxed">
                Drag-and-drop interface to build complex ML pipelines. Connect data sources, transformations, and models with ease.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 border-0 group">
            <CardContent className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Image src="/icons/automl.svg" alt="AutoML" width={32} height={32} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors">AutoML Capabilities</CardTitle>
              <p className="text-gray-300 leading-relaxed">
                Automated model selection, hyperparameter tuning, and feature engineering to accelerate your ML workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 border-0 group">
            <CardContent className="p-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Image src="/icons/monitoring.svg" alt="Monitoring" width={32} height={32} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Real-time Monitoring</CardTitle>
              <p className="text-gray-300 leading-relaxed">
                Monitor model performance, data drift, and system metrics in real-time with advanced analytics dashboards.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 py-24 relative">
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center mb-20">
          Enterprise-Grade Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Data Version Control", desc: "Version control for datasets and ML artifacts" },
            { title: "Distributed Training", desc: "Scale training across multiple machines" },
            { title: "Model Registry", desc: "Centralized model storage and versioning" },
            { title: "A/B Testing", desc: "Built-in support for model experimentation" }
          ].map((feature, i) => (
            <Card key={i} className="bg-gray-800/40 hover:bg-gray-700/40 backdrop-blur-sm border-0 transform hover:-translate-y-2 transition-all duration-300">
              <CardContent className="p-8">
                <CardTitle className="text-xl font-bold text-white mb-4">{feature.title}</CardTitle>
                <p className="text-gray-300">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
        <Separator className="mb-8 bg-gray-800" />
        <p className="text-gray-400 font-light">
          &copy; {new Date().getFullYear()} ML Pipeline Platform. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
