import { UserRound, ShieldCheck, PhoneCall, SlidersHorizontal, Tags } from "lucide-react";
import type { SellerRecord } from "../types";
import { Panel, DetailGrid, val } from "./shared";

export function SellerDetails({ seller }: { seller: SellerRecord }) {
  const identity = seller.seller_identity ?? {};
  const account = seller.account_status ?? {};
  const contact = seller.contact_context ?? {};
  const notes = seller.model_usage_notes ?? {};
  const categories = seller.categories_bl_last_6_months ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-2 animate-fade-in-up">
      {/* Seller Identity */}
      <Panel title="Seller Identity" icon={<UserRound size={16} />}>
        <DetailGrid
          items={[
            ["Company", identity.company_name],
            ["Contact person", identity.contact_person],
            ["Designation", identity.designation?.contact_page ?? identity.designation?.top_bar],
            ["City / State", `${val(identity.city)}, ${val(identity.state)}`],
            ["Business type", identity.business_type],
            ["Customer type", identity.customer_type],
            ["Employee count", identity.employee_count],
            ["Turnover", identity.turnover_range?.contact_page ?? identity.turnover_range?.top_bar],
          ]}
        />
      </Panel>

      {/* Account Status */}
      <Panel title="Account Status" icon={<ShieldCheck size={16} />}>
        <DetailGrid
          items={[
            ["Status", account.status],
            ["Created", account.created_date],
            ["Updated", account.updated_date],
            ["GL user", account.gluser],
            ["Website", account.website],
            ["Paid URL", account.paid_url],
            ["Sales servicing exec", account.sales_servicing_exec ?? "Not visible"],
            ["Tele CC exec", account.tele_cc_exec ?? "Not visible"],
          ]}
        />
      </Panel>

      {/* Contact Context */}
      <Panel title="Contact Context" icon={<PhoneCall size={16} />}>
        <DetailGrid
          items={[
            ["Primary mobile", contact.primary_mobile],
            ["Alternate mobile", contact.alternate_mobile],
            ["Phone", contact.phone],
            ["Primary email", contact.primary_email],
            ["Alternate email", contact.alternate_email ?? "Not visible"],
            ["Supplier PNS", contact.supplier_pns_number],
            ["PNS incoming", contact.pns_incoming_number],
            ["Privacy", contact.privacy_note],
          ]}
        />
      </Panel>

      {/* Category / Product Signals */}
      <Panel title="Category / Product Signals" icon={<Tags size={16} />}>
        {categories.length === 0 ? (
          <div className="text-xs font-medium text-muted">
            No enriched category data available.
          </div>
        ) : (
          <div className="space-y-2">
            {categories.slice(0, 5).map((category, idx) => (
              <CategorySignal key={`${category.mcat_name}-${idx}`} category={category} />
            ))}
          </div>
        )}
      </Panel>

      {/* AI Usage Notes */}
      <Panel title="AI Usage Notes" icon={<SlidersHorizontal size={16} />}>
        <div className="space-y-3">
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">💡</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Recommended Objective
              </span>
            </div>
            <div className="mt-2 text-sm font-semibold leading-relaxed text-blue-800">
              {val(notes.recommended_call_objective)}
            </div>
          </div>

          <div className="rounded-xl bg-red-50/50 border border-red-100 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-red-500">
              ⚠ Do not claim
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(notes.do_not_claim ?? []).map((item: string) => (
                <span
                  key={item}
                  className="rounded-md bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function CategorySignal({ category }: { category: Record<string, any> }) {
  const products = [
    ...(Array.isArray(category.primary_products) ? category.primary_products : []),
    ...(Array.isArray(category.secondary_products) ? category.secondary_products : []),
  ].slice(0, 4);

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-extrabold text-ink">
          {val(category.mcat_name)}
        </span>
        {category.rank && (
          <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
            Rank {category.rank}
          </span>
        )}
        {category.service && (
          <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
            {category.service}
          </span>
        )}
      </div>
      {products.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {products.map((product: string) => (
            <span
              key={product}
              className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600"
            >
              {product}
            </span>
          ))}
        </div>
      )}
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-slate-500">
        <span>Products: {val(category.no_of_products)}</span>
        <span>Total BL: {val(category.pur_bl_t_last_6m)}</span>
        <span>Paid BL: {val(category.pur_bl_p_last_6m)}</span>
      </div>
    </div>
  );
}
