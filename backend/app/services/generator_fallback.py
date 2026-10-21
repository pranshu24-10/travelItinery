import json
from typing import Dict, Any, List
from datetime import datetime, timedelta
from app.schemas.ai import AIItineraryResponse, AIDay, AIActivity

# Curated destination coordinates & knowledge base
DESTINATION_KNOWLEDGE = {
    "jaipur": {
        "coords": (26.9124, 75.7873),
        "areas": "Civil Lines, C-Scheme, or near Hawa Mahal in the Old Pink City for heritage havelis.",
        "tips": [
            "Purchase the composite monument ticket to save on entry fees for Amer Fort, Hawa Mahal, and Jantar Mantar.",
            "Hire authorized government guides at Amer Fort or use official audio guides.",
            "Bargain respectfully in Johari Bazaar and Bapu Bazaar for textiles and jewelry.",
            "Best time for photography at Hawa Mahal is early morning around sunrise before traffic picks up.",
            "Dress modestly when visiting temples and remove shoes before entering."
        ],
        "highlights": [
            ("Amer Fort & Maota Lake", "Majestic hilltop fort with stunning Sheesh Mahal mirror work and Rajput architecture.", "Sightseeing", 150, "morning", "Amer", 26.9855, 75.8513, "Cab or auto-rickshaw (11 km from city center)"),
            ("Anokhi Museum of Hand Printing", "Fascinating museum dedicated to traditional block printing with live artisan demonstrations.", "Culture & History", 80, "morning", "Kheri Gate, Amer", 26.9880, 75.8500, "5 min walk from Amer Fort"),
            ("1135 AD Royal Rajasthani Lunch", "Regal dining experience serving authentic Lal Maas, Gatte ki Sabzi, and saffron rice inside Amer Fort.", "Food & Dining", 400, "afternoon", "Amer Fort Ramparts", 26.9850, 75.8520, "Located directly inside fort grounds"),
            ("City Palace & Chandra Mahal", "Royal residence blending Mughal and Rajput architecture, museum galleries, and peacock courtyard.", "Sightseeing", 200, "afternoon", "Old City", 26.9258, 75.8236, "Auto-rickshaw to Old City"),
            ("Jantar Mantar Astronomical Observatory", "UNESCO site featuring the world's largest stone sundial and ancient astronomical instruments.", "Culture & History", 100, "afternoon", "Old City", 26.9248, 75.8246, "2 min walk across from City Palace"),
            ("Sunset Tea at Nahargarh Fort", "Panoramic clifftop views overlooking the pink expanse of Jaipur as the city lights up at dusk.", "Relaxation", 120, "evening", "Aravalli Hills", 26.9373, 75.8155, "Pre-booked taxi recommended for hilltop drive"),
            ("Johari Bazaar Evening Food Walk", "Sample crisp kachoris at Rawat Mishthan Bhandar, lassi at Lassiwala, and kulfi falooda.", "Food & Dining", 150, "evening", "Johari Bazaar", 26.9210, 75.8260, "Strolling through vibrant bazaar")
        ]
    },
    "goa": {
        "coords": (15.2993, 74.1240),
        "areas": "Candolim or Anjuna in North Goa for nightlife; Benaulim or Palolem in South Goa for tranquil beach retreats.",
        "tips": [
            "Rent a certified scooter or self-drive vehicle for freedom of movement between beaches.",
            "Carry cash or UPI; some beach shacks have intermittent card terminal connectivity.",
            "Always obey beach safety flags and avoid swimming after dark or in red flag zones.",
            "Try authentic Goan Fish Curry Thali and Bebinca at local family-run taverns."
        ],
        "highlights": [
            ("Old Goa Basilica of Bom Jesus", "UNESCO World Heritage 16th-century baroque cathedral holding sacred relics of St. Francis Xavier.", "Culture & History", 50, "morning", "Old Goa", 15.5009, 73.9116, "Taxi or local bus from Panaji"),
            ("Fontainhas Latin Quarter Walking Tour", "Stroll through colorful Portuguese colonial streets, pastel houses, and tiled balconies.", "Sightseeing", 80, "morning", "Panaji", 15.4989, 73.8278, "15 min drive from Old Goa"),
            ("Seafood Lunch at Viva Panjim", "Traditional family restaurant famous for Prawn Balchão, Pork Vindaloo, and Goan poi bread.", "Food & Dining", 250, "afternoon", "Fontainhas", 15.4985, 73.8275, "Short stroll inside Latin Quarter"),
            ("Anjuna / Vagator Coastal Exploration", "Scenic red laterite cliffs, Chapora Fort overlooking the Arabian Sea, and artisan flea markets.", "Nature & Adventure", 100, "afternoon", "Vagator", 15.6030, 73.7336, "Scooter or taxi north"),
            ("Sunset Beachfront Relaxation & Music", "Unwind with fresh coconut water and acoustic sundowner sessions by the waves.", "Relaxation", 150, "evening", "Ashwem Beach", 15.6586, 73.7153, "Short walk along sandy coastline")
        ]
    },
    "paris": {
        "coords": (48.8566, 2.3522),
        "areas": "Le Marais (3rd/4th arr.) for vibrant cafes and boutique charm, or Saint-Germain-des-Prés for classic literary atmosphere.",
        "tips": [
            "Use the Navigo Easy transit card or Paris Metro contactless on your phone for seamless travel.",
            "Book Eiffel Tower and Louvre tickets at least 3-4 weeks in advance to avoid long queues.",
            "A 10% service charge is included in restaurant bills; rounding up a few Euros for good service is customary.",
            "Museums are often closed on Tuesdays (Louvre) or Mondays (Musée d'Orsay)."
        ],
        "highlights": [
            ("Louvre Museum Masterpieces Tour", "Explore world treasures including the Mona Lisa, Winged Victory, and Venus de Milo.", "Culture & History", 25, "morning", "1st Arrondissement", 48.8606, 2.3376, "Metro Palais Royal - Musée du Louvre"),
            ("Tuileries Garden & Angelina Tearoom", "Stroll manicured sculpture gardens and sip renowned hot chocolate with mont-blanc pastry.", "Food & Dining", 22, "afternoon", "Rue de Rivoli", 48.8634, 2.3275, "5 min walk from Louvre"),
            ("Sainte-Chapelle & Île de la Cité", "Gaze up at breathtaking 13th-century stained glass windows and historic Notre-Dame exterior.", "Sightseeing", 15, "afternoon", "Île de la Cité", 48.8554, 2.3450, "10 min walk across Pont Neuf"),
            ("Seine River Sunset Cruise", "Glide past illuminated monuments and iconic stone bridges with audio historical commentary.", "Entertainment", 20, "evening", "Pont de l'Alma Pier", 48.8638, 2.3015, "Metro line 9 to Alma-Marceau")
        ]
    },
    "kyoto": {
        "coords": (35.0116, 135.7681),
        "areas": "Gion or Higashiyama for traditional machiya townhouses; Karasuma/Kawaramachi for central transit convenience.",
        "tips": [
            "Visit Fushimi Inari and Arashiyama Bamboo Grove before 8:00 AM to enjoy serene, crowd-free walks.",
            "Carry an IC card (Suica/Pasmo/ICOCA) which works seamlessly on all Kyoto buses, subways, and trains.",
            "Refrain from eating while walking; finish street snacks near the stall where purchased.",
            "Wear slip-on shoes as temple halls require removing footwear before entering wooden sanctums."
        ],
        "highlights": [
            ("Fushimi Inari Taisha Senbon Torii", "Hike through thousands of vermilion torii gates winding through sacred Mount Inari forests.", "Culture & History", 0, "morning", "Fushimi", 34.9671, 135.7727, "JR Nara Line to Inari Station (5 min from Kyoto Stn)"),
            ("Kiyomizu-dera & Historic Higashiyama Lanes", "Perched wooden temple terrace with sweeping city panoramas, Ninenzaka and Sannenzaka preserved lanes.", "Sightseeing", 500, "afternoon", "Higashiyama", 34.9949, 135.7850, "Kyoto City Bus 206 to Kiyomizu-michi"),
            ("Traditional Matcha & Kaiseki Tasting", "Savor seasonal multi-course Kyoto cuisine featuring local yuba, seasonal vegetables, and Uji matcha.", "Food & Dining", 3500, "evening", "Gion District", 35.0037, 135.7772, "Short walk along Shirakawa canal")
        ]
    }
}

def generate_fallback_itinerary(trip_data: Dict[str, Any]) -> AIItineraryResponse:
    city = trip_data.get("destination_city", "Global Destination").strip()
    country = trip_data.get("destination_country", "").strip()
    duration = max(1, min(trip_data.get("duration_days", 3), 14))
    currency = trip_data.get("currency", "USD")
    budget = float(trip_data.get("total_budget", 1000.0))
    travelers = max(1, trip_data.get("traveler_count", 1))
    travel_style = trip_data.get("travel_style", "balanced").lower()
    interests = trip_data.get("interests", ["Sightseeing", "Culture & History", "Food & Dining"])
    
    city_key = city.lower()
    known = None
    for k in DESTINATION_KNOWLEDGE:
        if k in city_key:
            known = DESTINATION_KNOWLEDGE[k]
            break
            
    # Daily budget per traveler
    daily_budget = max(20.0, budget / (duration * travelers))
    
    # Generate Days
    days: List[AIDay] = []
    
    # Theme templates
    themes = [
        "Historic Foundations & Iconic Landmarks",
        "Cultural Deep Dive, Local Markets & Culinary Delights",
        "Scenic Nature Trails & Panoramic Viewpoints",
        "Artisans, Hidden Courtyards & Sunset Strolls",
        "Adventure Highlights & Riverfront Explorations",
        "Leisure, Wellness & Twilight Dining",
        "Farewell Wonders & Memorable Keepsakes"
    ]
    
    # Base coordinates
    base_lat, base_lng = (20.5937, 78.9629) # Default
    if known:
        base_lat, base_lng = known["coords"]
    elif "manali" in city_key:
        base_lat, base_lng = (32.2396, 77.1887)
    elif "darjeeling" in city_key:
        base_lat, base_lng = (27.0410, 88.2663)
    elif "mumbai" in city_key:
        base_lat, base_lng = (18.9220, 72.8347)
    elif "delhi" in city_key:
        base_lat, base_lng = (28.6139, 77.2090)
    elif "rome" in city_key:
        base_lat, base_lng = (41.9028, 12.4964)
    elif "tokyo" in city_key:
        base_lat, base_lng = (35.6762, 139.6503)
    elif "bali" in city_key:
        base_lat, base_lng = (-8.3405, 115.0920)
    elif "new york" in city_key:
        base_lat, base_lng = (40.7128, -74.0060)

    for day_num in range(1, duration + 1):
        theme = themes[(day_num - 1) % len(themes)]
        daily_activities: List[AIActivity] = []
        
        # Determine number of activities based on pace
        if travel_style == "relaxed":
            slots = [("morning", "09:30", "12:00", 150), ("afternoon", "13:30", "16:00", 150), ("evening", "18:00", "20:30", 150)]
        elif travel_style == "packed":
            slots = [
                ("morning", "08:30", "10:30", 120),
                ("morning", "11:00", "12:30", 90),
                ("afternoon", "13:30", "15:30", 120),
                ("afternoon", "16:00", "17:30", 90),
                ("evening", "19:00", "21:30", 150)
            ]
        else: # balanced
            slots = [
                ("morning", "09:00", "11:30", 150),
                ("afternoon", "13:00", "15:30", 150),
                ("afternoon", "16:00", "17:30", 90),
                ("evening", "19:00", "21:00", 120)
            ]
            
        for i, (tod, start_t, end_t, dur) in enumerate(slots):
            # Check if curated activity exists for known city
            if known and len(known["highlights"]) > ((day_num - 1) * 3 + i):
                hl = known["highlights"][((day_num - 1) * 3 + i) % len(known["highlights"])]
                cost_val = round(min(hl[3], daily_budget * 0.4), 2)
                daily_activities.append(AIActivity(
                    title=hl[0],
                    description=hl[1],
                    time_of_day=tod,
                    start_time=start_t,
                    end_time=end_t,
                    duration_minutes=dur,
                    location_name=f"{hl[5]}, {city}",
                    latitude=hl[6],
                    longitude=hl[7],
                    category=hl[2],
                    estimated_cost=cost_val,
                    transportation_tip=hl[8]
                ))
            else:
                # Procedural high-quality activity
                lat_offset = ((day_num * 7 + i * 11) % 19 - 9) * 0.005
                lng_offset = ((day_num * 13 + i * 5) % 19 - 9) * 0.005
                
                if tod == "morning":
                    category = "Sightseeing" if i == 0 else "Culture & History"
                    title = f"{city} Heritage & Architecture Discovery" if i == 0 else f"{city} Historic Center Walking Tour"
                    desc = f"Experience the architectural heritage and signature landmarks of {city}. Immerse in the vibrant local ambiance, capturing memorable photos and discovering local traditions."
                    loc = f"Central Landmark Plaza, {city}"
                    cost = round(daily_budget * 0.20, 2)
                    tip = "Take the city transit line or enjoy a scenic 10-minute pedestrian stroll."
                elif tod == "afternoon":
                    if "Food" in "".join(interests) or i == 1:
                        category = "Food & Dining"
                        title = f"Authentic Culinary Tasting & Lunch in {city}"
                        desc = f"Savor regional specialties, seasonal culinary dishes, and refreshments at a well-regarded local bistro."
                        cost = round(daily_budget * 0.35, 2)
                        tip = "Conveniently located near the main pedestrian quarter."
                    else:
                        category = "Nature & Adventure" if "Nature" in "".join(interests) else "Sightseeing"
                        title = f"{city} Botanical Gardens & Scenic Viewpoint"
                        desc = f"Relax surrounded by verdant landscapes, open terraces, and panoramic city vistas."
                        cost = round(daily_budget * 0.15, 2)
                        tip = "Short taxi or local shuttle ride."
                    loc = f"Old Quarter & Riverside, {city}"
                else: # evening
                    category = "Food & Dining" if i == len(slots) - 1 else "Entertainment"
                    title = f"Twilight Promenade & Traditional Dinner in {city}"
                    desc = f"Unwind as the golden hour settles over {city}. Stroll illuminated avenues, browse evening artisan stalls, and enjoy a relaxed dinner."
                    loc = f"Downtown Waterfront / Evening Bazaar, {city}"
                    cost = round(daily_budget * 0.30, 2)
                    tip = "Walkable district with ample safe pedestrian access."
                
                daily_activities.append(AIActivity(
                    title=title,
                    description=desc,
                    time_of_day=tod,
                    start_time=start_t,
                    end_time=end_t,
                    duration_minutes=dur,
                    location_name=loc,
                    latitude=round(base_lat + lat_offset, 4),
                    longitude=round(base_lng + lng_offset, 4),
                    category=category,
                    estimated_cost=cost,
                    transportation_tip=tip
                ))
                
        days.append(AIDay(
            day_number=day_num,
            theme_title=f"Day {day_num}: {theme}",
            daily_notes=f"Today focuses on {theme.lower()} in {city}. Keep hydrated, wear comfortable walking footwear, and have local currency handy.",
            activities=daily_activities
        ))
        
    overview = (
        f"Welcome to your curated travel journey in {city}{', ' + country if country else ''}! "
        f"Designed specifically for {travelers} traveler{'s' if travelers > 1 else ''} with a {travel_style} pace, "
        f"this {duration}-day itinerary balances signature sights, authentic regional dining, and comfortable transit. "
        f"Estimated costs are tailored to align with your {trip_data.get('budget_tier', 'moderate')} budget of {budget:,.2f} {currency}."
    )
    
    accom = (
        known["areas"] if known else
        f"We recommend lodging in {city}'s central heritage quarter or near transit hubs for effortless access to key sights and evening dining."
    )
    
    tips = (
        known["tips"] if known else [
            f"Pre-download offline maps for {city} on your phone for easy navigation.",
            "Always keep small currency denominations or authorized mobile payment apps accessible for market vendors.",
            "Book top-tier museums and popular observation decks in advance during peak travel seasons.",
            "Respect local etiquette, dress modestly at spiritual sites, and greet shopkeepers warmly."
        ]
    )
    
    return AIItineraryResponse(
        trip_title=f"The Ultimate {city} Experience: {duration} Days of Discovery",
        trip_overview=overview,
        accommodation_recommendations=accom,
        local_tips=tips,
        days=days
    )

def generate_fallback_day(trip_data: Dict[str, Any], day_number: int, guidance: str = "") -> AIDay:
    city = trip_data.get("destination_city", "Destination")
    currency = trip_data.get("currency", "USD")
    budget = float(trip_data.get("total_budget", 1000.0))
    duration = max(1, trip_data.get("duration_days", 3))
    travelers = max(1, trip_data.get("traveler_count", 1))
    daily_budget = max(20.0, budget / (duration * travelers))
    
    base_lat, base_lng = (20.5937, 78.9629)
    for k in DESTINATION_KNOWLEDGE:
        if k in city.lower():
            base_lat, base_lng = DESTINATION_KNOWLEDGE[k]["coords"]
            break
            
    activities = [
        AIActivity(
            title=f"{city} Morning Exploration & Artisan Quarter",
            description=f"Discover morning markets, local craftsmanship, and scenic morning photography spots in {city}." + (f" Note: {guidance}" if guidance else ""),
            time_of_day="morning",
            start_time="09:00",
            end_time="11:30",
            duration_minutes=150,
            location_name=f"Artisan Square, {city}",
            latitude=round(base_lat + 0.01, 4),
            longitude=round(base_lng + 0.01, 4),
            category="Culture & History",
            estimated_cost=round(daily_budget * 0.25, 2),
            transportation_tip="Convenient via metro or short 10-minute cab ride."
        ),
        AIActivity(
            title=f"Signature Regional Lunch & Cafe Break",
            description=f"Indulge in freshly prepared local specialties and relax in a tranquil garden cafe atmosphere.",
            time_of_day="afternoon",
            start_time="12:30",
            end_time="14:00",
            duration_minutes=90,
            location_name=f"Old Town Bistro, {city}",
            latitude=round(base_lat - 0.005, 4),
            longitude=round(base_lng + 0.008, 4),
            category="Food & Dining",
            estimated_cost=round(daily_budget * 0.35, 2),
            transportation_tip="5-minute walk from Artisan Square."
        ),
        AIActivity(
            title=f"{city} Panoramic Vista & Sunset Gathering",
            description=f"Take in golden-hour views across the city skyline, followed by leisurely riverside strolls.",
            time_of_day="evening",
            start_time="17:00",
            end_time="19:30",
            duration_minutes=150,
            location_name=f"Highland Observatory / Waterfront, {city}",
            latitude=round(base_lat - 0.012, 4),
            longitude=round(base_lng - 0.01, 4),
            category="Sightseeing",
            estimated_cost=round(daily_budget * 0.30, 2),
            transportation_tip="Quick auto-rickshaw or taxi."
        )
    ]
    
    return AIDay(
        day_number=day_number,
        theme_title=f"Day {day_number}: Refreshed Curated Highlights & Hidden Spots",
        daily_notes=f"Refreshed personalized schedule for Day {day_number} focusing on fresh sights and relaxed exploration.",
        activities=activities
    )
