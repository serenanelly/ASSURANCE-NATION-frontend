"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, X } from "@/components/icons";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { buildQueryString } from "@/lib/utils";
import { formatSpecialite } from "@/lib/formatters";
import { cn } from "@/utils/cn";
import type { Medecin } from "@/types/user";
import type { PageResponse } from "@/types/api";

interface MedecinSelectProps {
  value?: string;
  onChange: (id: string | undefined) => void;
  label?: string;
  error?: string;
}

/**
 * Searchable médecin picker — fetches doctors from /users/medecins and returns
 * the selected doctor's real UUID, so the id is always valid.
 */
export function MedecinSelect({
  value,
  onChange,
  label = "Médecin traitant",
  error,
}: MedecinSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Medecin | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Resolve a preset value (e.g. edit) to a displayable doctor
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    if (selected?.id === value) return;
    let cancelled = false;
    api
      .get<Medecin>(`${apiConfig.endpoints.medecins}/${value}`)
      .then((r) => {
        if (!cancelled) setSelected(r.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const listQuery = useQuery({
    queryKey: ["medecin-select", query],
    enabled: open,
    queryFn: async () => {
      const { data } = await api.get<PageResponse<Medecin>>(
        `${apiConfig.endpoints.medecins}${buildQueryString({
          page: 0,
          size: 20,
          search: query || undefined,
        })}`
      );
      return data.content ?? [];
    },
  });

  const medecins = listQuery.data ?? [];

  const pick = (m: Medecin) => {
    setSelected(m);
    onChange(m.id);
    setOpen(false);
    setQuery("");
  };

  const clear = () => {
    setSelected(null);
    onChange(undefined);
    setQuery("");
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {selected ? (
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800",
              error && "border-error"
            )}
          >
            <span className="truncate text-sm text-foreground">
              Dr. {selected.prenom} {selected.nom} ·{" "}
              {formatSpecialite(selected.specialite)}
              {selected.specialiteLibelle ? ` (${selected.specialiteLibelle})` : ""}
            </span>
            <button
              type="button"
              onClick={clear}
              className="shrink-0 text-gray-400 hover:text-gray-600"
              aria-label="Retirer le médecin"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Rechercher un médecin (nom, RPPS)…"
              className={cn(
                "w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
                error && "border-error"
              )}
            />
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
          </div>
        )}

        {open && !selected && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 dark:border-gray-700 dark:bg-gray-900">
            {listQuery.isLoading ? (
              <li className="px-4 py-2 text-sm text-muted">Chargement…</li>
            ) : medecins.length === 0 ? (
              <li className="px-4 py-2 text-sm text-muted">Aucun médecin trouvé</li>
            ) : (
              medecins.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => pick(m)}
                    className="flex w-full flex-col items-start px-4 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm font-medium text-foreground">
                      Dr. {m.prenom} {m.nom}
                    </span>
                    <span className="text-xs text-muted">
                      {formatSpecialite(m.specialite)}
                      {m.specialiteLibelle ? ` · ${m.specialiteLibelle}` : ""} · RPPS{" "}
                      {m.numeroRPPS}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
