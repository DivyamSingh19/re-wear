"use client"
import React, { useState } from "react";
import {
  Search,
  User,
  BarChart3,
  Users,
  Settings,
  Smartphone,
  Bell,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dashboardCards = [
    {
      id: 1,
      title: "Analytics",
      description: "View your key metrics and performance indicators",
      icon: BarChart3,
    },
    {
      id: 2,
      title: "Users",
      description: "Manage user accounts and permissions",
      icon: Users,
    },
    {
      id: 3,
      title: "Settings",
      description: "Configure your application preferences",
      icon: Settings,
    },
    {
      id: 4,
      title: "Mobile",
      description: "Access mobile-specific features and tools",
      icon: Smartphone,
    },
    {
      id: 5,
      title: "Notifications",
      description: "Stay updated with important alerts",
      icon: Bell,
    },
    {
      id: 6,
      title: "Reports",
      description: "Generate detailed reports and insights",
      icon: TrendingUp,
    },
  ];

  const filteredCards = dashboardCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (title:any) => {
    alert(`Opening ${title} module...`);
  };

  const handleUserClick = () => {
    alert("User menu would open here");
  };

  return (
    <div className="min-h-screen aboslute flex flex-col bg-black relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-white/5 rounded-full top-1/2 -right-40 animate-bounce"></div>
        <div className="absolute w-64 h-64 bg-white/10 rounded-full -bottom-32 left-1/3 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleUserClick}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <User className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
              Welcome to your dashboard
            </h2>
            <p className="text-xl text-white/80 animate-fade-in-delay">
              Everything you need to manage your application
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.title)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="h-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10">
                    <div
                      className={`w-16 h-16  rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-white/70 line-height-relaxed group-hover:text-white/90 transition-colors">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-xl">
                No results found for "{searchTerm}"
              </div>
              <p className="text-white/40 mt-2">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.2s both;
        }

        .line-height-relaxed {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
