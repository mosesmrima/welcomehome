"use client"

import { Card, CardContent } from "@/app/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Toronto, Canada",
    content: "Welcome Home made it possible for me to invest in prime real estate back home in Kenya. The process was transparent and I love receiving my monthly returns.",
    rating: 5,
    investment: "$2,500"
  },
  {
    name: "David Ochieng",
    location: "London, UK",
    content: "I never thought I could own property in Nairobi while living abroad. This platform has revolutionized diaspora investment opportunities.",
    rating: 5,
    investment: "$5,000"
  },
  {
    name: "Grace Mutua",
    location: "Atlanta, USA",
    content: "The tokenized approach gives me flexibility to invest small amounts and diversify across multiple properties. Brilliant concept!",
    rating: 5,
    investment: "$1,200"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">
            Trusted by Diaspora Investors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of diaspora investors building wealth through blockchain-powered real estate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Investment</div>
                    <div className="font-semibold text-green-600">{testimonial.investment}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2.3M+</div>
              <div className="text-gray-600">Total Investment Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1,250+</div>
              <div className="text-gray-600">Active Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Properties Tokenized</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}