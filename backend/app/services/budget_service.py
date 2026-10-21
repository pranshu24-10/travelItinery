from typing import Dict, Any, List
from app.models.trip import Trip

def calculate_trip_budget_analytics(trip: Trip) -> Dict[str, Any]:
    total_budget = float(trip.total_budget or 0.0)
    traveler_count = max(1, trip.traveler_count or 1)
    currency = trip.currency or "USD"
    
    daily_breakdown: List[Dict[str, Any]] = []
    category_totals: Dict[str, float] = {
        "Sightseeing": 0.0,
        "Food & Dining": 0.0,
        "Nature & Adventure": 0.0,
        "Culture & History": 0.0,
        "Transport": 0.0,
        "Relaxation": 0.0,
        "Shopping": 0.0,
        "Entertainment": 0.0,
        "Accommodation": 0.0,
        "Miscellaneous": 0.0
    }
    
    total_activities_cost = 0.0
    
    # Calculate costs per day and per category
    for day in trip.days:
        day_cost = 0.0
        for act in day.activities:
            cost = float(act.estimated_cost or 0.0)
            day_cost += cost
            total_activities_cost += cost
            
            cat = act.category or "Sightseeing"
            if cat in category_totals:
                category_totals[cat] += cost
            else:
                category_totals["Miscellaneous"] += cost
                
        daily_breakdown.append({
            "day_number": day.day_number,
            "theme_title": day.theme_title or f"Day {day.day_number}",
            "date": day.date,
            "estimated_cost": round(day_cost, 2),
            "activity_count": len(day.activities)
        })
        
    # Estimate reasonable lodging/transport if not listed as explicit activities
    # Accommodation baseline depending on budget tier
    tier = (trip.budget_tier or "moderate").lower()
    base_hotel_rate = 60.0 if tier == "budget" else (150.0 if tier == "moderate" else (280.0 if tier == "premium" else 500.0))
    if currency == "INR":
        base_hotel_rate = 2500.0 if tier == "budget" else (6500.0 if tier == "moderate" else (14000.0 if tier == "premium" else 28000.0))
        
    estimated_lodging = round(base_hotel_rate * max(1, trip.duration_days - 1), 2)
    category_totals["Accommodation"] = round(category_totals["Accommodation"] + estimated_lodging, 2)
    
    grand_total_estimated = round(total_activities_cost + estimated_lodging, 2)
    remaining_budget = round(total_budget - grand_total_estimated, 2)
    cost_per_traveler = round(grand_total_estimated / traveler_count, 2)
    is_over_budget = grand_total_estimated > total_budget
    overage_amount = round(grand_total_estimated - total_budget, 2) if is_over_budget else 0.0

    # Format category chart data
    categories_list = []
    for cat_name, amt in category_totals.items():
        if amt > 0:
            pct = round((amt / grand_total_estimated) * 100, 1) if grand_total_estimated > 0 else 0
            categories_list.append({
                "category": cat_name,
                "amount": round(amt, 2),
                "percentage": pct
            })

    return {
        "total_budget": total_budget,
        "currency": currency,
        "total_estimated_spending": grand_total_estimated,
        "remaining_budget": remaining_budget,
        "cost_per_traveler": cost_per_traveler,
        "traveler_count": traveler_count,
        "is_over_budget": is_over_budget,
        "overage_amount": overage_amount,
        "daily_breakdown": daily_breakdown,
        "category_breakdown": categories_list,
        "disclaimer": "All prices are realistic approximations based on current market trends and tier selection. Bookings and live availability are subject to real-world tariffs."
    }
