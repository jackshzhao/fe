const en_US = {
  title: 'Active Alerts',
  search_placeholder: 'Multiple keywords separated by spaces',
  hours: {
    6: 'Last 6 Hours',
    12: 'Last 12 Hours',
    24: 'Last 1 Day',
    48: 'Last 2 Days',
    72: 'Last 3 Days',
    168: 'Last 7 Days',
    336: 'Last 14 Days',
    720: 'Last 30 Days',
    1440: 'Last 60 Days',
    2160: 'Last 90 Days',
  },
  severity: 'Severity',
  eventType: 'Event Type',
  rule_name: 'Rule Name & Event Tags',
  first_trigger_time: 'First Triggered',
  trigger_time: 'Triggered',
  shield: 'Shield',
  aggregate_rule: 'Aggregate Rule',
  aggregate_rule_name: 'Rule Name',
  public: 'Public',
  isPublic: 'Is Public',
  prod: 'Type',
  status: 'Status',
  status_1: 'Claimed',
  status_0: 'Unclaimed',
  batch_btn: 'Batch Operation',
  batch_claim: 'Batch Claim',
  batch_unclaim: 'Batch Unclaim',
  claim: 'Claim',
  unclaim: 'Unclaim',
  claimant: 'Claimant by',

  delete_confirm: {
    title: 'Delete Alert Event',
    content:
      'Usually, alert events are only deleted when it is determined that the monitoring data will never be reported again (such as when the monitoring data tags are adjusted or the machine is offline), because the related alert events can never be automatically restored. Are you sure you want to do this?',
  },

  detail: {
    title: 'Alert Detail',
    card_title: 'Event Detail',
    buisness_not_exist: 'This business group has been deleted or has no permission to view',
    rule_name: 'Rule Title',
    group_name: 'Business Group',
    rule_note: 'Rule Note',
    cate: 'Datasource Type',
    datasource_id: 'Datasource',
    severity: 'Severity',
    is_recovered: 'Status',
    tags: 'Tags',
    target_note: 'Target Note',
    trigger_time: 'Triggered',
    trigger_value: 'Trigger Value',
    recover_time: 'Recover Time',
    rule_algo: 'Alert Type',
    rule_algo_anomaly: 'Anomaly',
    rule_algo_threshold: 'Threshold',
    prom_eval_interval: 'Execution frequency',
    prom_for_duration: 'Duration',
    notify_channels: 'Receiving Channels',
    notify_groups_obj: 'Receiving Groups',
    callbacks: 'Callbacks',
    runbook_url: 'Runbook URL',
    detail_url: 'Detail URL',
    host: {
      trigger: 'Trigger',
    },
    trigger: 'Trigger',
  },
};
export default en_US;
