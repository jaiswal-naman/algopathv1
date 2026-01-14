"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LFADocument } from "@/types";
import {
  Trophy,
  Star,
  Award,
  Target,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Medal,
  Crown,
  Rocket,
  Brain,
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (lfa: LFADocument, features: FeatureUsage) => boolean;
  tier: "bronze" | "silver" | "gold" | "platinum";
  points: number;
}

interface FeatureUsage {
  stakeholderInterviews: number;
  logicChallengeRun: boolean;
  whatIfScenarios: number;
  pyramidViewed: boolean;
  scoreViewed: boolean;
  tocPlayed: boolean;
}

const TIER_COLORS = {
  bronze: "from-amber-600 to-amber-800",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-400 to-yellow-600",
  platinum: "from-cyan-400 to-purple-500",
};

const TIER_BG = {
  bronze: "bg-amber-50 border-amber-200",
  silver: "bg-gray-50 border-gray-200",
  gold: "bg-yellow-50 border-yellow-200",
  platinum: "bg-gradient-to-br from-cyan-50 to-purple-50 border-purple-200",
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_lfa",
    name: "LFA Creator",
    description: "Generated your first LFA document",
    icon: <Trophy className="h-5 w-5" />,
    condition: (lfa) => !!lfa.goal,
    tier: "bronze",
    points: 100,
  },
  {
    id: "outcome_master",
    name: "Outcome Master",
    description: "Created 3+ outcomes in your LFA",
    icon: <Target className="h-5 w-5" />,
    condition: (lfa) => lfa.outcomes.length >= 3,
    tier: "silver",
    points: 150,
  },
  {
    id: "stakeholder_aligned",
    name: "Stakeholder Aligned",
    description: "Mapped activities to multiple hierarchy levels",
    icon: <Users className="h-5 w-5" />,
    condition: (lfa) => {
      const levels = new Set<string>();
      lfa.outcomes.forEach(oc => {
        oc.outputs.forEach(op => {
          op.activities.forEach(act => {
            const resp = (act.responsible_stakeholder || "").toLowerCase();
            if (resp.includes("teacher") || resp.includes("hm")) levels.add("school");
            if (resp.includes("crp")) levels.add("cluster");
            if (resp.includes("brp") || resp.includes("beo")) levels.add("block");
            if (resp.includes("deo") || resp.includes("diet")) levels.add("district");
          });
        });
      });
      return levels.size >= 3;
    },
    tier: "gold",
    points: 250,
  },
  {
    id: "smart_indicators",
    name: "SMART Thinker",
    description: "Added 5+ measurable indicators",
    icon: <Star className="h-5 w-5" />,
    condition: (lfa) => {
      let count = lfa.goal_indicators.length;
      lfa.outcomes.forEach(oc => {
        count += oc.indicators.length;
        oc.outputs.forEach(op => {
          count += op.indicators.length;
        });
      });
      return count >= 5;
    },
    tier: "silver",
    points: 150,
  },
  {
    id: "assumption_aware",
    name: "Risk Aware",
    description: "Documented 3+ key assumptions",
    icon: <Shield className="h-5 w-5" />,
    condition: (lfa) => (lfa.assumptions?.length || 0) >= 3,
    tier: "bronze",
    points: 100,
  },
  {
    id: "stakeholder_voices",
    name: "Stakeholder Listener",
    description: "Interviewed 3+ stakeholder personas",
    icon: <Users className="h-5 w-5" />,
    condition: (_, features) => features.stakeholderInterviews >= 3,
    tier: "gold",
    points: 250,
  },
  {
    id: "devils_advocate",
    name: "Critical Thinker",
    description: "Ran the AI Devil's Advocate analysis",
    icon: <Brain className="h-5 w-5" />,
    condition: (_, features) => features.logicChallengeRun,
    tier: "silver",
    points: 150,
  },
  {
    id: "scenario_planner",
    name: "Scenario Planner",
    description: "Tested 2+ what-if scenarios",
    icon: <Zap className="h-5 w-5" />,
    condition: (_, features) => features.whatIfScenarios >= 2,
    tier: "gold",
    points: 250,
  },
  {
    id: "pyramid_explorer",
    name: "Hierarchy Explorer",
    description: "Explored the Stakeholder Pyramid",
    icon: <Crown className="h-5 w-5" />,
    condition: (_, features) => features.pyramidViewed,
    tier: "bronze",
    points: 100,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Used all 6 analysis features",
    icon: <Medal className="h-5 w-5" />,
    condition: (_, features) =>
      features.stakeholderInterviews > 0 &&
      features.logicChallengeRun &&
      features.whatIfScenarios > 0 &&
      features.pyramidViewed &&
      features.scoreViewed &&
      features.tocPlayed,
    tier: "platinum",
    points: 500,
  },
];

interface AchievementBadgesProps {
  lfaDocument: LFADocument;
  featureUsage?: FeatureUsage;
  compact?: boolean;
}

export function AchievementBadges({
  lfaDocument,
  featureUsage = {
    stakeholderInterviews: 0,
    logicChallengeRun: false,
    whatIfScenarios: 0,
    pyramidViewed: false,
    scoreViewed: false,
    tocPlayed: false,
  },
  compact = false,
}: AchievementBadgesProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  // Calculate earned achievements
  const earnedAchievements = ACHIEVEMENTS.filter((a) =>
    a.condition(lfaDocument, featureUsage)
  );
  const lockedAchievements = ACHIEVEMENTS.filter(
    (a) => !a.condition(lfaDocument, featureUsage)
  );

  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);
  const maxPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);

  // Animation on mount
  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {earnedAchievements.slice(0, 5).map((achievement, idx) => (
            <div
              key={achievement.id}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                bg-gradient-to-br ${TIER_COLORS[achievement.tier]}
                text-white border-2 border-white shadow-sm
                ${showAnimation ? "animate-bounce" : ""}
              `}
              style={{ animationDelay: `${idx * 100}ms` }}
              title={achievement.name}
            >
              {achievement.icon}
            </div>
          ))}
          {earnedAchievements.length > 5 && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted border-2 border-white text-xs font-bold">
              +{earnedAchievements.length - 5}
            </div>
          )}
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          {totalPoints} pts
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with total points */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Achievements
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Unlock badges by building better LFAs
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{totalPoints}</span>
            <span className="text-muted-foreground">/ {maxPoints} pts</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {earnedAchievements.length} / {ACHIEVEMENTS.length} badges earned
          </p>
        </div>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Earned ({earnedAchievements.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {earnedAchievements.map((achievement, idx) => (
              <Card
                key={achievement.id}
                className={`
                  ${TIER_BG[achievement.tier]} border-2 overflow-hidden
                  ${showAnimation ? "animate-pulse" : ""}
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardContent className="p-3 text-center">
                  <div
                    className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      bg-gradient-to-br ${TIER_COLORS[achievement.tier]} text-white
                      shadow-lg mb-2
                    `}
                  >
                    {achievement.icon}
                  </div>
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {achievement.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 text-xs capitalize"
                  >
                    {achievement.tier} • {achievement.points} pts
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Locked ({lockedAchievements.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {lockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="border-dashed opacity-60"
              >
                <CardContent className="p-3 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-muted text-muted-foreground mb-2">
                    <Lock className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-sm text-muted-foreground">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {achievement.description}
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    +{achievement.points} pts
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
