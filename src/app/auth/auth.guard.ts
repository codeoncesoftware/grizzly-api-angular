import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    //Vérifier sl'existance du token, user mail et que le token est toujours valide
    if (token && userEmail && !this.isTokenExpired(token)) {
      return true; // Autoriser l'accès à la route
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = decodedToken.exp * 1000; // Convertir en millisecondes
      const currentDate = new Date().getTime();

      return currentDate > expirationDate;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return true; // Considérer le token comme expiré en cas d'erreur
    }
  }
}
