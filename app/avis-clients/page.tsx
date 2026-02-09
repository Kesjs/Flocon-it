"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, MessageSquare, ArrowLeft, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  helpful: number;
  product?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Sophie M.",
    rating: 5,
    date: "15 janvier 2026",
    verified: true,
    title: "Service impeccable et produits magnifiques",
    content: "J'ai commandé un coffret Saint-Valentin pour mon compagnon. La qualité est exceptionnelle, l'emballage soigné et la livraison ultra-rapide. Je recommande vivement !",
    helpful: 12,
    product: "Coffret Duo Tendresse"
  },
  {
    id: "2", 
    author: "Thomas L.",
    rating: 4,
    date: "10 janvier 2026",
    verified: true,
    title: "Belle expérience d'achat",
    content: "Produits conformes à la description, site facile à naviguer. Seul petit bémol : le délai de livraison un peu plus long qu'annoncé.",
    helpful: 8,
    product: "Plaid Hiver Douceur"
  },
  {
    id: "3",
    author: "Marie-Claire D.",
    rating: 5,
    date: "5 janvier 2026", 
    verified: true,
    title: "Parfait pour les cadeaux !",
    content: "J'achète régulièrement chez Flocon pour offrir. Toujours satisfaite des réactions ! Les produits sont originaux et de grande qualité.",
    helpful: 15,
    product: "Bougie Parfumée Cocooning"
  }
];

export default function AvisClients() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number>(0);

  const filteredAndSortedReviews = reviews
    .filter(review => filterRating === 0 || review.rating >= filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="pt-28 min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-custom hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Avis Clients Vérifiés
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les témoignages authentiques de nos clients. 
              Tous nos avis sont vérifiés pour garantir leur authenticité.
            </p>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Note moyenne */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900 mr-3">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex mb-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-sm text-gray-600">
                      Basé sur {reviews.length} avis
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Avis vérifiés
                </div>
              </div>

              {/* Distribution */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Répartition des notes</h3>
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">Filtres :</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-custom"
                >
                  <option value={0}>Toutes les notes</option>
                  <option value={5}>5 étoiles</option>
                  <option value={4}>4 étoiles et plus</option>
                  <option value={3}>3 étoiles et plus</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-custom"
                >
                  <option value="recent">Plus récents</option>
                  <option value="helpful">Plus utiles</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des avis */}
          <div className="space-y-6">
            {filteredAndSortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-custom/10 rounded-full flex items-center justify-center">
                      <span className="text-rose-custom font-semibold text-lg">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{review.author}</h3>
                        {review.verified && (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Achat vérifié
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.content}</p>
                
                {review.product && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Produit acheté : </span>
                    <span className="text-sm font-medium text-rose-custom">{review.product}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-rose-custom transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Utile ({review.helpful})
                    </button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                    Avis authentifié par notre système anti-fraude
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Partagez votre expérience
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Votre avis compte et aide d'autres clients à faire leur choix. 
              Laissez-nous votre témoignage sur votre dernière commande.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-rose-custom text-white font-medium rounded-lg hover:bg-rose-custom/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Rédiger un avis
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
