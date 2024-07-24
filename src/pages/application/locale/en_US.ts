const en_US = {
  title: 'Application List',
  default_filter: 'Preset filters',
  ungrouped_targets: 'Ungrouped applications',
  all_targets: 'All applications',
  datasource: 'Datasource',
  search_placeholder: 'Multiple keywords are separated by spaces',
  ident_copy_success: '{{num}} records successfully copied',
  filterDowntime: 'Downtime over',
  filterDowntimeMin: '{{count}} minute',
  filterDowntimeMin_plural: '{{count}} minutes',
  not_grouped: 'Ungrouped',
  host_ip: 'IP',
  tags: 'Tags',
  group_obj: 'Business group',
  target_up: 'Status',
  mem_util: 'Memory',
  cpu_util: 'CPU',
  cpu_num: 'Cores',
  offset: 'Offset',
  offset_tip: 'The calculation logic is to subtract the time when the machine is deployed by Nightingale from the time when the machine is deployed by categraf',
  os: 'OS',
  arch: 'CPU Arch',
  update_at: 'Update at',
  update_at_tip: `
    Heartbeat within 1 minute: Green <1 />
    Heartbeat within 3 minutes: yellow <1 />
    No heartbeat within 3 minutes: red
  `,
  remote_addr: 'Remote Addr',
  remote_addr_tip: 'Remote Addr is obtained from HTTP Header, if it is passed through a proxy, it may not be the real Remote Addr',
  agent_version: 'Agent Version',
  note: 'Note',
  unknown_tip: 'The display of machine meta information requires categraf version to be higher than 0.2.35',
  organize_columns: {
    title: 'Organize Columns',
  },
  targets: 'Hosts',
  targets_placeholder: 'Please fill in the hosts, one per line',
  copy: {
    current_page: 'Copy current page',
    all: 'Copy all',
    selected: 'Copy selected',
    no_data: 'No data to copy',
  },
  bind_tag: {
    title: 'Bind tag',
    placeholder: 'Tag format is key=value, separated by enter or space',
    msg1: 'Please fill in at least one tag!',
    msg2: 'Tag format is incorrect, please check!',
    msg3: 'Tag key cannot have duplicate',
    render_tip1: 'Tag length should be less than or equal to 64 bits',
    render_tip2: 'Tag format should be key=value. And key starts with a letter or underscore, and is composed of letters, numbers and underscores.',
  },
  unbind_tag: {
    title: 'Unbind tag',
    placeholder: 'Please select the tag to unbind',
    msg: 'Please fill in at least one tag!',
  },
  update_busi: {
    title: 'Update business group',
    label: 'Business group',
  },
  remove_busi: {
    title: 'Remove business group',
    msg: 'Warning: Remove the business group, the business group manager will no longer have permission to operate these hosts! You may need to clear the tags and notes of this batch of hosts beforehand!',
    btn: 'Remove',
  },
  update_note: {
    title: 'Update note',
    placeholder: 'If the content is empty, the note will be cleared',
  },
  batch_delete: {
    title: 'Batch delete',
    msg: 'Warning: This operation will permanently delete the hosts from the system, very dangerous, be careful!',
    btn: 'Delete',
  },
  meta_tip: 'View Meta Info',
  meta_title: 'Information',
  meta_desc_key: 'Key',
  meta_desc_value: 'Value',
  meta_value_click_to_copy: 'Click to copy',
  meta_expand: 'Expand',
  meta_collapse: 'Collapse',
  meta_no_data: 'No data',
  all_no_data: 'No collector deployed? Please refer to <a>Installation Manual</a> for installation and deployment',
};
export default en_US;
