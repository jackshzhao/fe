export const tippyMap: Record<string,(type: string, ident: string, ip: string, state: string, cpu_util: number, mem_util: number, alert_num: number, health_level: number, arch: string) => string> = {
    'custom-gateway': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU：</td>
            <td style="text-align: left;">${cpu_util}%</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">内存：</td>
            <td style="text-align: left;">${mem_util}%</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-router': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-switch': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-database': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-firewall': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-loadbalance': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-middleware': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-pc': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
    'custom-server': (type,ident,ip,state,cpu_util,mem_util,alert_num,health_level,arch,) => `
        <div style="font-size: 12px; line-height: 1.5;">
        <table style="border-collapse: collapse;">
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">类型：</td>
            <td style="text-align: left;">${type}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">标识：</td>
            <td style="text-align: left;">${ident}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">IP：</td>
            <td style="text-align: left;">${ip}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">状态：</td>
            <td style="text-align: left;">${state}</td>
        </tr>                  
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">告警数：</td>
            <td style="text-align: left;">${alert_num}</td>
        </tr>
        <tr>
            <td style="text-align: right; padding-right: 8px; white-space: nowrap;">健康值：</td>
            <td style="text-align: left;">${health_level}</td>
        </tr>
        <tr>
        <td style="text-align: right; padding-right: 8px; white-space: nowrap;">CPU架构：</td>
        <td style="text-align: left;">${arch}</td>
        </tr>
        </table>
    </div>
    `,
}