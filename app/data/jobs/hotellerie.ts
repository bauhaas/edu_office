import type { JobPage } from '#shared/types/job'

export const hotellerie = {
  slug: 'hotellerie',
  title: 'Hôtellerie, Restauration & Tourisme',
  tagline: 'Et si ton métier c’était de rendre les gens heureux ?',
  sections: [
    {
      id: 'subjobs',
      type: 'subjobs',
      items: [
        {
          id: 'restauration',
          label: 'Restauration & Cuisine',
          cover: { src: '/images/cover-restauration.jpg', alt: 'Un chef dresse des assiettes en cuisine' },
          stickers: [
            { id: 'fork', asset: { src: '/images/sticker-fork.png', alt: '' }, x: 80, y: 32, width: 34, rotate: 18 },
            { id: 'oui-chef', asset: { src: '/images/sticker-oui-chef.png', alt: '' }, x: 34, y: 66, width: 46, rotate: -10 }
          ]
        },
        {
          id: 'gestion',
          label: 'Gestion Hôtelière',
          cover: { src: '/images/cover-gestion.jpg', alt: 'Une responsable marketing dans un grand hôtel' },
          stickers: [
            { id: 'key', asset: { src: '/images/sticker-key.png', alt: '' }, x: 80, y: 52, width: 40, rotate: -20 }
          ]
        },
        {
          id: 'tourisme',
          label: 'Tourisme & Expérience voyageur',
          cover: { src: '/images/cover-tourisme.jpg', alt: 'Une équipe d’agence de voyage à son bureau' },
          stickers: [
            { id: 'stamp', asset: { src: '/images/sticker-stamp.png', alt: '' }, x: 24, y: 36, width: 36, rotate: -12 },
            { id: 'boarding-pass', asset: { src: '/images/sticker-boarding-pass.png', alt: '' }, x: 76, y: 52, width: 40, rotate: 8 }
          ]
        },
        {
          id: 'service',
          label: 'Service & Accueil',
          cover: { src: '/images/cover-service.jpg', alt: 'Deux employés souriants au service' },
          stickers: [
            { id: 'bell', asset: { src: '/images/sticker-bell.png', alt: '' }, x: 30, y: 70, width: 38, rotate: -6 }
          ]
        }
      ]
    },
    {
      id: 'about',
      type: 'about',
      title: 'À propos',
      body: 'Une filière ouverte et accessible, où le savoir-faire, l’engagement et l’expérience pèsent autant que les diplômes : on peut y entrer par un CAP, un bac pro, un BTS ou un Bachelor, et évoluer rapidement vers des postes à responsabilités. Hôtels, restaurants, agences de voyage, croisières, événementiel : les terrains de jeu sont nombreux, en France comme à l’étranger.',
      stats: {
        medianStartingSalary: 2000,
        openPositions: { count: 319000, year: 2026 },
        professionalsCount: 1300000,
        trainingsCount: 797
      }
    },
    {
      id: 'faq',
      type: 'faq',
      title: 'Bon à savoir',
      items: [
        {
          id: 'bac',
          question: 'Bac général, techno ou pro ?',
          answer: 'Tous les bacs mènent au secteur. Le bac pro permet d’entrer vite dans la vie active, le bac STHR (techno) est taillé pour poursuivre en BTS, et un bac général ouvre les portes des Bachelors et écoles de management hôtelier.'
        },
        {
          id: 'diplomes',
          question: 'CAP, BTS ou Bachelor ?',
          answer: 'Le CAP forme en 2 ans à un métier précis (cuisine, service). Le BTS MHR apporte une vision plus large et des postes d’encadrement. Le Bachelor vise la gestion, le marketing ou l’international.'
        },
        {
          id: 'recrutement',
          question: 'Le secteur recrute-t-il vraiment ?',
          answer: 'Oui : plus de 300 000 postes sont à pourvoir chaque année. Les profils motivés trouvent rapidement, souvent dès la fin de leur alternance.'
        },
        {
          id: 'ia',
          question: 'Et par rapport à l’IA ?',
          answer: 'L’accueil, le service et la cuisine reposent sur le contact humain et le geste : des métiers parmi les moins exposés à l’automatisation. L’IA aide surtout côté réservations et gestion.'
        }
      ]
    },
    {
      id: 'pros-cons',
      type: 'prosCons',
      title: 'Le métier sans filtre',
      items: [
        {
          id: 'ouvert',
          kind: 'pro',
          title: 'Un métier ouvert à tous',
          body: 'Le savoir-faire, l’engagement et l’expérience comptent autant que les diplômes. On peut commencer par un CAP et évoluer vers des responsabilités.'
        },
        {
          id: 'evolution',
          kind: 'pro',
          title: 'De vraies perspectives d’évolution',
          body: 'Tu peux progresser rapidement, travailler partout dans le monde, rejoindre le luxe ou ouvrir ton propre établissement.'
        },
        {
          id: 'horaires',
          kind: 'con',
          title: 'Des horaires décalés',
          body: 'Soirées, week-ends et jours fériés : tu travailles quand les autres se détendent. Il faut aimer ce rythme.'
        },
        {
          id: 'physique',
          kind: 'con',
          title: 'Un métier physique',
          body: 'Station debout, coups de feu, pression du service : l’endurance et la gestion du stress font partie du job.'
        }
      ]
    },
    {
      id: 'cta',
      type: 'cta',
      title: 'Quelle voie est faite pour toi ?',
      subtitle: 'En 2 min. top chrono !',
      buttonLabel: 'Passe le test',
      href: 'https://www.edumapper.com'
    },
    {
      id: 'tips',
      type: 'tips',
      title: 'Prends une longueur d’avance',
      items: [
        { id: 'culture', icon: 'fluent-emoji:pushpin', text: 'Développe ta culture du secteur : nouvelles adresses, destinations, cultures étrangères…' },
        { id: 'langues', icon: 'fluent-emoji:globe-showing-europe-africa', text: 'Travaille tes langues : l’anglais est indispensable, une deuxième langue fait la différence.' },
        { id: 'job', icon: 'fluent-emoji:fork-and-knife-with-plate', text: 'Teste-toi avec un job d’été ou un stage en restaurant, hôtel ou office de tourisme.' },
        { id: 'reseau', icon: 'fluent-emoji:handshake', text: 'Parle avec des pros : salons, journées portes ouvertes, réseaux sociaux.' }
      ]
    },
    {
      id: 'collage',
      type: 'collage',
      items: [
        { id: 'palm-large', asset: { src: '/images/collage-palm.png', alt: '' }, x: 17, y: 51, width: 36, rotate: 0, secret: null },
        { id: 'palm-small', asset: { src: '/images/collage-palm.png', alt: '' }, x: 31, y: 82, width: 24, rotate: 0, secret: null },
        { id: 'oui-chef', asset: { src: '/images/sticker-oui-chef.png', alt: '' }, x: 5, y: 20, width: 29, rotate: -15, secret: null },
        { id: 'michelin', asset: { src: '/images/collage-michelin.png', alt: '' }, x: 43, y: 52, width: 6, rotate: 0, secret: null },
        { id: 'bell', asset: { src: '/images/sticker-bell.png', alt: '' }, x: 99, y: 18, width: 16, rotate: 0, secret: null },
        { id: 'key', asset: { src: '/images/sticker-key.png', alt: '' }, x: 97, y: 42, width: 26, rotate: 160, secret: null },
        { id: 'hand-plate', asset: { src: '/images/collage-hand-plate.png', alt: '' }, x: 63, y: 60, width: 34, rotate: 0, secret: null },
        { id: 'plane-window', asset: { src: '/images/collage-plane-window.png', alt: '' }, x: 49, y: 95, width: 27, rotate: 0, secret: null },
        {
          id: 'tanya',
          asset: { src: '/images/collage-tanya.png', alt: 'Tanya, personnage de The White Lotus' },
          x: 86,
          y: 64,
          width: 40,
          rotate: 0,
          secret: {
            showHint: true,
            title: 'Le client roi ?',
            body: 'Dans The White Lotus, Tanya incarne une cliente aussi attachante qu’imprévisible. Derrière l’humour de la série se cache une réalité : les professionnels de l’hôtellerie doivent savoir répondre aux attentes des clients, même dans les situations les plus délicates.'
          }
        },
        { id: 'grass', asset: { src: '/images/collage-grass.png', alt: '' }, x: 88, y: 92, width: 46, rotate: 0, secret: null },
        {
          id: 'ratatouille',
          asset: { src: '/images/collage-ratatouille.png', alt: 'Rémy, le rat cuisinier de Ratatouille' },
          x: 68,
          y: 85,
          width: 28,
          rotate: 0,
          secret: {
            showHint: false,
            title: 'Tout le monde peut cuisiner ?',
            body: 'Dans Ratatouille, Rémy devient chef dans un grand restaurant parisien. La morale colle au secteur : peu importe d’où tu viens, ce sont le talent et l’envie d’apprendre qui te font progresser.'
          }
        },
        {
          id: 'chef',
          asset: { src: '/images/collage-chef-glasses.png', alt: 'Une cheffe aux lunettes rondes' },
          x: 15,
          y: 86,
          width: 31,
          rotate: 0,
          secret: {
            showHint: false,
            title: 'Cheffe étoilée ?',
            body: 'Beaucoup de grandes tables récompensées par le guide Michelin sont tenues par des chefs qui ont commencé par un CAP ou un apprentissage. En cuisine, c’est le travail, la rigueur et la curiosité qui font la différence.'
          }
        }
      ]
    }
  ]
} satisfies JobPage
