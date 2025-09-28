import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('The Game Loop');
  protected readonly isMobileMenuOpen = signal(false);
  protected newsletterEmail = '';

  constructor(private router: Router) {}

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected navigateToSearch(): void {
    console.log('Search button clicked - navigating to search');
    this.router.navigate(['/search']);
  }

  protected subscribeNewsletter(): void {
    if (this.newsletterEmail) {
      // TODO: Implement newsletter subscription logic
      console.log('Newsletter subscription for:', this.newsletterEmail);
      // You can integrate with your email service here
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    }
  }
}
