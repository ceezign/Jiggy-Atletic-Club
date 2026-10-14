"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { getResource, FieldDef, ResourceConfig } from "@/lib/adminConfig";

type Row = Record<string, any>;

export default function AdminResourcePage() {
  const params = useParams<{ resource: string }>();
  const config = getResource(params.resource);

  if (!config) return <p className="text-muted">That section doesn&apos;t exist.</p>;
  return <Manager key={config.key} config={config} />;
}

function Manager({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [relations, setRelations] = useState<Record<string, Row[]>>({});

  const load = useCallback(async () => {
    try {
      setRows(await api.get<Row[]>(`/api/admin/${config.key}`));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [config.key]);

  useEffect(() => {
    load();
    config.fields
      .filter((f) => f.type === "relation" && f.relation)
      .forEach((f) => {
        api.get<Row[]>(`/api/admin/${f.relation!.resource}`).then((data) =>
          setRelations((prev) => ({ ...prev, [f.relation!.resource]: data }))
        );
      });
  }, [load, config.fields]);

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete this ${config.singular}? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/admin/${config.key}/${row.id}`);
      setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted.`);
      load();
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Could not delete.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-ivory">{config.title}</h1>
          <p className="text-muted mt-1 text-sm">{config.description}</p>
        </div>
        {config.canCreate !== false && (
          <button
            onClick={() => { setNotice(null); setEditing("new"); }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors"
          >
            <Plus className="w-4 h-4" /> Add {config.singular}
          </button>
        )}
      </div>

      {notice && <p className="mt-5 text-sm text-violet">{notice}</p>}
      {error && <p className="mt-5 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="mt-8 text-muted">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto scroll-thin rounded-soft border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs text-muted">
              <tr>
                {config.columns.map((c) => (
                  <th key={c.label} className="px-4 py-3 font-medium whitespace-nowrap">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/5 hover:bg-surface/60">
                  {config.columns.map((c) => (
                    <td key={c.label} className="px-4 py-3 text-ivory/90 max-w-xs truncate">{c.value(row)}</td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button onClick={() => { setNotice(null); setEditing(row); }} className="inline-flex items-center gap-1 text-violet hover:text-volt mr-4">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    {config.canDelete !== false && (
                      <button onClick={() => remove(row)} className="inline-flex items-center gap-1 text-danger hover:underline">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <FormDrawer
          config={config}
          row={editing === "new" ? null : editing}
          relations={relations}
          onClose={() => setEditing(null)}
          onSaved={(msg) => { setEditing(null); setNotice(msg); load(); }}
        />
      )}
    </div>
  );
}

function initialValues(config: ResourceConfig, row: Row | null) {
  const v: Record<string, any> = {};
  for (const f of config.fields) {
    if (row) {
      const cur = row[f.name];
      v[f.name] = f.type === "list" ? (cur || []).join(", ") : f.type === "checkbox" ? !!cur : cur ?? "";
    } else {
      v[f.name] = f.type === "checkbox" ? !["isRecommended", "isRead"].includes(f.name) : f.type === "select" ? f.options?.[0] ?? "" : "";
    }
  }
  return v;
}

function FormDrawer({
  config, row, relations, onClose, onSaved,
}: {
  config: ResourceConfig;
  row: Row | null;
  relations: Record<string, Row[]>;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [values, setValues] = useState(() => initialValues(config, row));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (name: string, value: any) => setValues((p) => ({ ...p, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      if (row) await api.put(`/api/admin/${config.key}/${row.id}`, values);
      else await api.post(`/api/admin/${config.key}`, values);
      onSaved(row ? "Changes saved." : `New ${config.singular} added.`);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        if (err.details && typeof err.details === "object") setFieldErrors(err.details as Record<string, string>);
      } else setFormError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full overflow-y-auto bg-charcoal border-l border-white/10 p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ivory">
            {row ? "Edit" : "Add"} {config.singular}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ivory">
            <X className="w-5 h-5" />
          </button>
        </div>

        {config.fields.map((f) => (
          <FieldInput key={f.name} field={f} value={values[f.name]} error={fieldErrors[f.name]} relations={relations} onChange={(v) => set(f.name, v)} />
        ))}

        {formError && <p className="text-sm text-danger">{formError}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose} className="px-6 py-3 border border-white/20 text-ivory font-semibold rounded-sharp hover:border-volt hover:text-volt transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldInput({
  field, value, error, relations, onChange,
}: {
  field: FieldDef; value: any; error?: string; relations: Record<string, Row[]>; onChange: (v: any) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 text-sm text-ivory">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />
        {field.label}
      </label>
    );
  }

  let control: React.ReactNode;
  if (field.type === "textarea") {
    control = <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="input resize-y" />;
  } else if (field.type === "select") {
    control = (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        {field.options!.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
      </select>
    );
  } else if (field.type === "relation" && field.relation) {
    const options = relations[field.relation.resource] || [];
    control = (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.id} value={o.id}>{field.relation!.label(o)}</option>)}
      </select>
    );
  } else {
    control = (
      <input
        type={field.type === "number" ? "number" : "text"}
        step={field.type === "number" ? "any" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    );
  }

  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1.5">
        {field.label}{field.required && <span className="text-volt"> *</span>}
      </span>
      {control}
      {field.help && <span className="block text-xs text-muted/80 mt-1">{field.help}</span>}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}
