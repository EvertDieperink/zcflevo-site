---
# ==========================================================================
# HOMEPAGE van zcflevo.nl
# Alle teksten van de homepage staan hieronder. Pas alleen de tekst tussen
# de aanhalingstekens aan; laat de namen voor de dubbele punt staan.
# Foto's voor de homepage staan in de map assets/images/home/. Hugo maakt
# er automatisch kleinere, snelle versies van.
# Bij "position" bepaal je de uitsnede van een foto: "50% 50%" is het
# midden; het eerste getal schuift links/rechts, het tweede boven/onder.
# "position_mobile" is de uitsnede op een telefoon.
# ==========================================================================

title: "Zweefvliegclub Flevo"
description: "Zweefvliegclub Flevo is een actieve zweefvliegclub gevestigd bij Vliegveld Terlet, Arnhem."

menu:
  main:
    name: "Home"
    weight: 1

# --------------------------------------------------------------------------
# HERO: de grote foto bovenaan met titel en knoppen
# --------------------------------------------------------------------------
hero_tag: "Vliegveld Terlet · Arnhem"
# Een punt gevolgd door een spatie zet de rest van de titel op een nieuwe regel.
hero_title: "Zweef mee. Voel de vrijheid."
hero_subtitle: "ZC Flevo is een actieve zweefvliegclub vanuit Vliegveld Terlet bij Arnhem. Geen motor, puur vliegen op thermiek."

# Wisselende hero-foto's (elke 7 seconden een zachte overgang).
# - Foto toevoegen: zet het bestand in assets/images/home/ en voeg hieronder
#   een blok toe (src, position, position_mobile, alt).
# - Foto verwijderen: haal het hele blok (vanaf "- src") weg.
# - De volgorde hier is de volgorde in de slideshow; de eerste foto zie je
#   als eerste. Met één foto wisselt er niets.
# - shade: "warm" geeft een warm (bruin) verloop, handig bij een
#   zonsondergang. Laat het weg voor het standaard blauwe verloop.
# - alt: korte beschrijving van de foto voor blinden en slechtzienden.
hero_images:
  - src: "zonsondergang.jpg"
    position: "50% 33%"
    position_mobile: "46% 50%"
    shade: "warm"
    alt: "Silhouet van een zweefvliegtuig voor een gouden zonsondergang"
  - src: "landing-heide-8k.jpg"
    position: "50% 29%"
    position_mobile: "52% 50%"
    alt: "Een wit zweefvliegtuig vliegt laag over het gras van de heide tegen een strakblauwe lucht"
  - src: "lierstart-ls7wl.jpg"
    position: "50% 62%"
    position_mobile: "42% 50%"
    alt: "Een lid van ZC Flevo in de cockpit van de LS7-wl tijdens een lierstart"

# Knoppen in de hero. Deze knoppen staan ook onderaan de pagina (slotsectie).
# style: "primary" = rode knop met pijl, "outline" = witte omlijnde knop.
hero_buttons:
  - text: "Meer over de stage"
    url: "/de-mogelijkheden/kennismakingsstage/"
    style: "primary"
  - text: "Neem contact op"
    url: "/contact/"
    style: "outline"

# --------------------------------------------------------------------------
# KERNCIJFERS: de blauwe balk onder de hero
# icon kan zijn: "kalender", "zweefvliegtuig", "route" of "blad".
# --------------------------------------------------------------------------
stats:
  - value: "1972"
    label: "Opgericht"
    icon: "kalender"
  - value: "7"
    label: "Zweefvliegtuigen"
    icon: "zweefvliegtuig"
  - value: "1000+"
    label: "km per vlucht mogelijk"
    icon: "route"
  - value: "0"
    label: "gram CO₂ uitstoot"
    icon: "blad"

# --------------------------------------------------------------------------
# WELKOM: links het label en de kop, rechts de tekst onderaan dit bestand
# (onder de streepjes). De eerste alinea wordt groter getoond; een alinea
# met het e-mailadres krijgt een blauw kader.
# --------------------------------------------------------------------------
welcome_label: "Welkom"
welcome_title: "Welkom bij Zweefvliegclub Flevo"

# --------------------------------------------------------------------------
# VLIEGROUTE: "Van nieuwsgierig naar brevet", met drie waypoints
# --------------------------------------------------------------------------
route:
  label: "Wat biedt ZC Flevo?"
  title: "Van nieuwsgierig naar brevet"
  start_label: "Start"
  finish_label: "Brevet"
  finish_title: "Bestemming bereikt: zweefvliegpiloot"

# Waypoint 1: de kennismakingsstage
# label = tekst in de blauwe balk bovenaan de kaart
stage_callout:
  label: "Zo start je bij ZC Flevo"
  title: "Iedereen begint met de kennismakingsstage"
  text: "Wil je leren zweefvliegen bij ZC Flevo? Dan begin je met de kennismakingsstage: 6 starts in 2 dagen, begeleid door een instructeur. Voor €180 ontdek je hoe het er bij ons aan toegaat. De stage is volledig vrijblijvend, je beslist na afloop zelf of je lid wilt worden. Word je lid, dan wordt het volledige bedrag verrekend als korting op je inschrijfgeld."
  # De drie feitjes in het kader boven de tekst
  facts:
    - value: "6"
      label: "starts"
    - value: "2"
      label: "dagen"
    - value: "€180"
      label: "vrijblijvend"
  cta_text: "Meer over de stage"
  cta_url: "/de-mogelijkheden/kennismakingsstage/"
  image: "twee-piloten.jpg"
  image_position: "50% 25%"
  image_position_mobile: "30% 30%"
  image_alt: "Instructeur en leerling samen in de cockpit van de Duo Discus, vlak boven het veld"

# Waypoint 2: lid worden en de kosten
# head = tekst in de blauwe balk, label = tekst boven de Senior/Junior-keuze
pricing:
  head: "Lid worden"
  label: "Onbeperkt vliegen"
  title: "Onbeperkt zweefvliegen vanaf €806 per jaar"
  description: "Inclusief vlieglessen en opleiding tot brevet, onbeperkt starten en gebruik van alle clubvliegtuigen."
  cta_text: "Bekijk alle kosten"
  cta_url: "/de-mogelijkheden/lidmaatschap/"
  image: "lach-dg1000.jpg"
  image_position: "50% 50%"
  image_position_mobile: "80% 50%"
  image_alt: "Een lid van ZC Flevo zit lachend in de cockpit van de DG-1000 van de club"
  # Eerste tab = Senior, tweede tab = Junior. "label_small" staat klein achter het label.
  tabs:
    - label: "Senior"
      contribution: "€765"
      contribution_label: "Contributie + startabonnement"
      knvvl: "€201"
      knvvl_label: "KNVVL lidmaatschap"
      total: "€966"
      total_label: "Totaal per jaar, all-in"
      installments: "± €96,60 per maand"
    - label: "Junior"
      label_small: "(t/m 21 jr)"
      contribution: "€685"
      contribution_label: "Contributie + startabonnement"
      knvvl: "€121"
      knvvl_label: "KNVVL lidmaatschap"
      total: "€806"
      total_label: "Totaal per jaar, all-in"
      installments: "± €80,60 per maand"
      note: "Voor leden van 19 t/m 21 jaar geldt het volwassen KNVVL-tarief (2026: €201, totaal dan ± €886). KNVVL-tarieven worden jaarlijks vastgesteld en kunnen wijzigen."

# Waypoint 3: de opleiding tot brevet
training:
  head: "Opleiding & Lidmaatschap"
  title: "Opleiding tot brevet"
  # De twee leeftijden in de gekleurde vakjes
  ages:
    - value: "14"
      unit: "jaar"
      label: "minimumleeftijd"
    - value: "16"
      unit: "jaar"
      label: "brevet halen"
  text: "Word zweefvliegpiloot via onze vliegopleiding. Minimumleeftijd is 14 jaar, brevet halen kan vanaf 16 jaar. Instructie, gebruik clubvliegtuigen en startmiddelen inbegrepen."
  cta_text: "Meer weten"
  cta_url: "/de-mogelijkheden/lidmaatschap/"
  image: "duim-discus.jpg"
  image_position: "50% 50%"
  image_position_mobile: "12% 50%"
  image_alt: "Een lid van ZC Flevo steekt zijn duim op vanuit de cockpit van de Discus-2b"

# --------------------------------------------------------------------------
# ONZE CLUB: foto met kaart ernaast
# --------------------------------------------------------------------------
club:
  head: "Vliegveld Terlet"
  title: "Onze Club"
  text: "ZC Flevo is een actieve en gezellige club met meer dan 50 jaar ervaring. Leer meer over onze geschiedenis, vloot en locatie bij Arnhem."
  cta_text: "Meer weten"
  cta_url: "/onze-club/"
  image: "vliegdag-terlet.jpg"
  image_position: "50% 50%"
  image_position_mobile: "40% 50%"
  image_alt: "Een lid van ZC Flevo in de cockpit van de LS4-b op het grasveld van Terlet, met andere clubtoestellen en de bosrand op de achtergrond"

# --------------------------------------------------------------------------
# LEDEN VERTELLEN: drie citaten. Avatars staan in static/images/.
# --------------------------------------------------------------------------
testimonials:
  label: "Leden vertellen"
  title: "Wat onze leden zeggen"
  subtitle: "Lees waarom onze leden zo enthousiast zijn over ZC Flevo"
  cta_text: "Lees meer verhalen"
  cta_url: "/leden-vertellen/"
  items:
    - quote: "Ik vlieg nu drie jaar bij ZC Flevo. Mijn vader en broer vliegen ook, dus we zijn vaak samen op de club te vinden. Ik vlieg inmiddels solo en heb al echt vette vluchten gemaakt."
      name: "Stan"
      role: "Lid van ZC Flevo"
      avatar: "/images/portret-stan.jpg"
    - quote: "Zweefvliegclub Flevo is een vereniging waar iedereen welkom is om te leren vliegen. De balans tussen serieus vliegen en clubgezelligheid maakt het uniek."
      name: "Annemieke"
      role: "Lid van ZC Flevo"
      avatar: "/images/annemieke.jpg"
    - quote: "Zweefvliegen is voor mij meer dan een hobby… het is een lifestyle. ZC Flevo is uiterst gezellig en gepassioneerd: ontspanning, uitdaging en plezier in één."
      name: "Erwin"
      role: "Lid van ZC Flevo"
      avatar: "/images/portret-erwin.jpg"

# --------------------------------------------------------------------------
# SLOTSECTIE onderaan de pagina. De knoppen zijn dezelfde als in de hero
# (hero_buttons). Het e-mailadres komt uit hugo.toml en staat tussen
# text_before en text_after.
# --------------------------------------------------------------------------
closing:
  label: "Je volgende stap"
  title: "Klaar voor waypoint 1?"
  text_before: "Neem contact op via"
  text_after: "of lees meer op deze site."
  image: "leden-startplaats.jpg"
  image_position: "50% 55%"
  image_position_mobile: "62% 50%"
---

ZC Flevo is een **actieve en gezellige zweefvliegclub** die al meer dan 50 jaar bestaat. Onze leden komen uit allerlei beroepen en delen één passie: de zweefvliegsport.

Wij maken gebruik van een **elektrische lier** om onze motorloze vliegtuigen de lucht in te sturen. Onder goede omstandigheden kunnen zweefvliegtuigen urenlang in de lucht blijven op thermiek, warme stijgende luchtstromen.

Zweefvliegen is een **betaalbare hobby**. Doordat de club volledig door de leden zelf wordt gerund, zijn de kosten laag in vergelijking met gemotoriseerde luchtvaart.

Ben je benieuwd? Neem contact op via {{< email >}} of lees meer op deze site.
