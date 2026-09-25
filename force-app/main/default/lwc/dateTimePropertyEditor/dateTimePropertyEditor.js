import { LightningElement, api } from "lwc";

export default class DateTimePropertyEditor extends LightningElement {
  @api value;
  @api label;
  @api description;

  get resolvedLabel() {
    return this.label || "Date and time";
  }

  handleChange(event) {
    const next = event.detail.value || "";
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("valuechange", {
        detail: { value: next }
      })
    );
  }
}
