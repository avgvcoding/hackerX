import { UserRound, ShieldCheck, PhoneCall, SlidersHorizontal } from "lucide-react";
import type { SellerRecord } from "../types";
import { Panel, DetailGrid, val } from "./shared";

export function SellerDetails({ seller }: { seller: SellerRecord }) {
  const identity = seller.seller_identity ?? {};
  const account = seller.account_status ?? {};
  const contact = seller.contact_context ?? {};
  const notes = seller.model_usage_notes ?? {};

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
