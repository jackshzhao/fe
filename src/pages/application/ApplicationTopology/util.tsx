import { iconMap } from './Graph/topologyIcons'
export function converttopologyDatatoStandard(topologyData: any) {
    const nodes = topologyData?.nodes ?? [];
    const edges = topologyData?.edges ?? [];
  
    const app_topology_node = nodes.map((node: any) => {
      const portItems = node.ports?.items || [];
  
      const getPortIdByGroup = (group: string): string => {
        const item = portItems.find((item: any) => item.group === group);
        return item?.id || '';
      };
  
      return {
        node_id: node.id,
        node_type: node.type,
        node_shape: node.shape,
        position_x: node.position?.x || 0,
        position_y: node.position?.y || 0,
        size_width: node.size?.width || 40,
        size_height: node.size?.height || 40,
        node_name: node.attrs?.label?.text || '',
        target_id: node.attrs?.label?.nodeId ?? null,
        port_top_id: getPortIdByGroup('top'),
        port_bottom_id: getPortIdByGroup('bottom'),
        port_left_id: getPortIdByGroup('left'),
        port_right_id: getPortIdByGroup('right')
      };
    });
  
    const app_topology_edge = edges.map((edge: any) => ({
      edge_id: edge.id,
      source_node_id: edge.source.cell,
      source_node_port: edge.source.port,
      target_node_id: edge.target.cell,
      target_node_port: edge.target.port
    }));
  
    return {
      app_name: topologyData?.appName || '',
      app_id: topologyData?.group_id || null,
      app_topology_node,
      app_topology_edge
    };
  }

  export function convertStandardToTopologyData(standardData: any) {
    if (
      !standardData ||
      !Array.isArray(standardData.app_topology_node) ||
      !Array.isArray(standardData.app_topology_edge)
    ) {
      console.warn('无效拓扑数据:', standardData);
      return {
        nodes: [],
        edges: [],
      };
    }
  
    const nodes = standardData.app_topology_node.map((node: any) => {
        const shape = node.node_shape; 
        const iconHtml = iconMap[shape] ? iconMap[shape]('rgb(49,59,73)', 30) : '';
      const ports = {
        items: [
          { group: 'top', id: node.port_top_id },
          { group: 'bottom', id: node.port_bottom_id },
          { group: 'left', id: node.port_left_id },
          { group: 'right', id: node.port_right_id }
        ],
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#2D8CF0',
                strokeWidth: 1,
                fill: '#fff',
                style: { visibility: 'hidden' }
              }
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#2D8CF0',
                strokeWidth: 1,
                fill: '#fff',
                style: { visibility: 'hidden' }
              }
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#2D8CF0',
                strokeWidth: 1,
                fill: '#fff',
                style: { visibility: 'hidden' }
              }
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#2D8CF0',
                strokeWidth: 1,
                fill: '#fff',
                style: { visibility: 'hidden' }
              }
            }
          }
        }
      };
  
      return {
        id: node.node_id,
        shape: node.node_shape,
        type: node.node_type,
        position: { x: node.position_x, y: node.position_y },
        size: { width: node.size_width, height: node.size_height },
        attrs: {
          fo: { html: iconHtml },
          label: {
            text: node.node_name,
            nodeId: node.target_id,
            ident: '', // 可根据需要扩展
            ip: '',
            fontSize: 12,
            refY: '120%',
          }
        },
        visible: true,
        ports,
        zIndex: 1
      };
    });
  
    const edges = standardData.app_topology_edge.map((edge: any) => ({
      id: edge.edge_id,
      shape: 'edge',
      zIndex: 0,
      source: {
        cell: edge.source_node_id,
        port: edge.source_node_port
      },
      target: {
        cell: edge.target_node_id,
        port: edge.target_node_port
      },
      attrs: {
        line: {
          stroke: '#000',
          strokeWidth: 1,
          targetMarker: null,
          sourceMarker: null
        }
      }
    }));
  
    return { group_id:standardData.app_id,
                nodes, 
                edges };
  }
  
  