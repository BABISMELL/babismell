import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">BABISMELL</h3>
            <p className="text-sm text-gray-600 mb-4">
              Votre destination de confiance pour les parfums de luxe authentiques en Côte d'Ivoire.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/parfums" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                  Nos Parfums
                </Link>
              </li>
              <li>
                <Link to="/nouveautes" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link to="/favoris" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                  Favoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>+225 07 59 93 70 93</li>
              <li>contact@babismell.com</li>
              <li>Cocody Blockhauss, Abidjan</li>
              <li>Côte d'Ivoire</li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Inscrivez-vous pour recevoir nos offres exclusives
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-white"
              />
              <Button className="w-full">S'inscrire</Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid gap-4 md:grid-cols-2">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © {currentYear} BABISMELL. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <Link to="/mentions-legales" className="text-sm text-gray-600 hover:text-purple-600">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="text-sm text-gray-600 hover:text-purple-600">
                Politique de confidentialité
              </Link>
              <Link to="/cgv" className="text-sm text-gray-600 hover:text-purple-600">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}