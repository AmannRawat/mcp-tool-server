import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new McpServer({
    name: 'Weather Data fetcher',
    version: '1.0.0',
})

//Weather data is ahrd coded only for example we can use api instead of this
async function getWeatherByCity(city = '') {
    if (city.toLowerCase() === 'dehradun') {
        return {
            temp: '18 Degree Celsius',
            forecast: "Chnaced of high rainfall"
        }
    }
    if (city.toLowerCase() === 'delhi') {
        return {
            temp: '40 Degree Celsius',
            forecast: "Chnaced of heatwave"
        }
    }
    return { temp: null, error: 'Unable to get data for this city' }
}

server.registerTool(
    'getWeatherdatabyCityName',
    {
        description: 'Get weather data for a city',
        inputSchema: z.object({
            city: z.string().describe('Enter city name')
        })
    },
    async ({ city }) => {
        const weather = await getWeatherByCity(city);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(weather)
                }
            ]
        };
    }
);

async function init() {
    const transport = new StdioServerTransport();
    await server.connect(transport)
}

init();