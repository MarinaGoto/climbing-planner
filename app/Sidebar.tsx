"use client";

import { ClimberProfile } from "@/lib/types";

interface SidebarProps {
  climber: ClimberProfile;
  setClimber: (climber: ClimberProfile) => void;
  partner: ClimberProfile;
  setPartner: (partner: ClimberProfile) => void;
  preferredTypes: string[];
  setPreferredTypes: (types: string[]) => void;
  date: string;
  setDate: (date: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function Sidebar({
  climber,
  setClimber,
  partner,
  setPartner,
  preferredTypes,
  setPreferredTypes,
  date,
  setDate,
  onSubmit,
  loading,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white p-3 shadow-sm space-y-5 h-screen overflow-y-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">Filters</h1>
          <p className="text-sm text-slate-500">
            Select climb types and apply level, partner, and date filters.
          </p>
        </div>

        {/* Preferred Types */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-foreground">
            Climbing styles
          </h2>

          <div className="flex flex-col gap-3">
            {["bouldering", "sport", "trad"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferredTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPreferredTypes([...preferredTypes, type]);
                    } else {
                      setPreferredTypes(
                        preferredTypes.filter((t) => t !== type),
                      );
                    }
                  }}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-foreground capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {preferredTypes.length === 0 ? (
          <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-slate-600">
            Pick one or more of the climb types above to show level and partner
            filters.
          </div>
        ) : (
          <>
            {/* Climber Profile */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-foreground">
                Your level
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {preferredTypes.map((type) => (
                  <div key={type} className="space-y-4">
                    <h3 className="text-base font-medium text-foreground capitalize">
                      {type}
                    </h3>

                    {type === "trad" ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            Trad Comfort
                          </label>
                          <input
                            type="text"
                            value={climber.trad.comfortGrade}
                            onChange={(e) =>
                              setClimber({
                                ...climber,
                                trad: {
                                  ...climber.trad,
                                  comfortGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g. 5.8"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            Trad Risk
                          </label>
                          <select
                            value={climber.trad.riskTolerance}
                            onChange={(e) =>
                              setClimber({
                                ...climber,
                                trad: {
                                  ...climber.trad,
                                  riskTolerance: e.target.value as any,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            {type === "bouldering" ? "Bouldering" : "Sport"} Max
                          </label>
                          <input
                            type="text"
                            value={
                              climber[type as "bouldering" | "sport"].maxGrade
                            }
                            onChange={(e) =>
                              setClimber({
                                ...climber,
                                [type]: {
                                  ...climber[type as "bouldering" | "sport"],
                                  maxGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={
                              type === "bouldering" ? "e.g. V5" : "e.g. 5.10d"
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            {type === "bouldering" ? "Bouldering" : "Sport"}{" "}
                            Comfort
                          </label>
                          <input
                            type="text"
                            value={
                              climber[type as "bouldering" | "sport"]
                                .comfortGrade
                            }
                            onChange={(e) =>
                              setClimber({
                                ...climber,
                                [type]: {
                                  ...climber[type as "bouldering" | "sport"],
                                  comfortGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={
                              type === "bouldering" ? "e.g. V3" : "e.g. 5.9"
                            }
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Profile */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-foreground">
                Partner level
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {preferredTypes.map((type) => (
                  <div key={type} className="space-y-4">
                    <h3 className="text-base font-medium text-foreground capitalize">
                      {type}
                    </h3>

                    {type === "trad" ? (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            Trad Comfort
                          </label>
                          <input
                            type="text"
                            value={partner.trad.comfortGrade}
                            onChange={(e) =>
                              setPartner({
                                ...partner,
                                trad: {
                                  ...partner.trad,
                                  comfortGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g. 5.8"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            Trad Risk
                          </label>
                          <select
                            value={partner.trad.riskTolerance}
                            onChange={(e) =>
                              setPartner({
                                ...partner,
                                trad: {
                                  ...partner.trad,
                                  riskTolerance: e.target.value as any,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            {type === "bouldering" ? "Bouldering" : "Sport"} Max
                          </label>
                          <input
                            type="text"
                            value={
                              partner[type as "bouldering" | "sport"].maxGrade
                            }
                            onChange={(e) =>
                              setPartner({
                                ...partner,
                                [type]: {
                                  ...partner[type as "bouldering" | "sport"],
                                  maxGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={
                              type === "bouldering" ? "e.g. V5" : "e.g. 5.10d"
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">
                            {type === "bouldering" ? "Bouldering" : "Sport"}{" "}
                            Comfort
                          </label>
                          <input
                            type="text"
                            value={
                              partner[type as "bouldering" | "sport"]
                                .comfortGrade
                            }
                            onChange={(e) =>
                              setPartner({
                                ...partner,
                                [type]: {
                                  ...partner[type as "bouldering" | "sport"],
                                  comfortGrade: e.target.value,
                                },
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={
                              type === "bouldering" ? "e.g. V3" : "e.g. 5.9"
                            }
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Climbing Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {loading ? "Finding..." : "Find spots"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
