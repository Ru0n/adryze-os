import xmlrpc from 'xmlrpc';

// Odoo connection configuration
const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL || 'https://erp.adryze.com';
const ODOO_DB = process.env.ODOO_DB || 'Panc_live';
console.log("Using Odoo DB:", ODOO_DB);

interface OdooClientConfig {
    uid: number;
    password: string;
}

/**
 * Odoo XML-RPC Client
 * Provides type-safe methods for interacting with Odoo models
 */
export class OdooClient {
    private client: any;
    private uid: number;
    private password: string;

    constructor(config: OdooClientConfig) {
        const url = new URL(ODOO_URL);

        this.client = xmlrpc.createSecureClient({
            host: url.hostname,
            port: 443,
            path: '/xmlrpc/2/object',
        });

        this.uid = config.uid;
        this.password = config.password;
    }

    /**
     * Execute a method on an Odoo model
     */
    private async executeKW(
        model: string,
        method: string,
        args: any[] = [],
        kwargs: Record<string, any> = {}
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.methodCall(
                'execute_kw',
                [ODOO_DB, this.uid, this.password, model, method, args, kwargs],
                (error: any, value: any) => {
                    if (error) {
                        console.error(`Odoo API Error [${model}.${method}]:`, error);
                        reject(new Error(`Odoo API Error: ${error.message || 'Unknown error'}`));
                    } else {
                        resolve(value);
                    }
                }
            );
        });
    }

    /**
     * Search and read records from an Odoo model
     */
    async searchRead<T>(
        model: string,
        domain: any[] = [],
        fields: string[] = [],
        limit?: number,
        offset?: number
    ): Promise<T[]> {
        const kwargs: any = { fields };
        if (limit) kwargs.limit = limit;
        if (offset) kwargs.offset = offset;

        return this.executeKW(model, 'search_read', [domain], kwargs);
    }

    /**
     * Create a new record in an Odoo model
     */
    async create(model: string, values: Record<string, any>): Promise<number> {
        return this.executeKW(model, 'create', [values]);
    }

    /**
     * Update existing records in an Odoo model
     */
    async write(model: string, ids: number[], values: Record<string, any>): Promise<boolean> {
        return this.executeKW(model, 'write', [ids, values]);
    }

    /**
     * Delete (archive) records from an Odoo model
     */
    async unlink(model: string, ids: number[]): Promise<boolean> {
        return this.executeKW(model, 'unlink', [ids]);
    }

    /**
     * Search for record IDs matching a domain
     */
    async search(model: string, domain: any[] = [], limit?: number): Promise<number[]> {
        const kwargs: any = {};
        if (limit) kwargs.limit = limit;

        return this.executeKW(model, 'search', [domain], kwargs);
    }

    /**
     * Read specific fields from records
     */
    async read<T>(model: string, ids: number[], fields: string[] = []): Promise<T[]> {
        return this.executeKW(model, 'read', [ids], { fields });
    }
}

/**
 * Authenticate with Odoo and return UID
 */
export async function authenticateOdoo(username: string, password: string): Promise<number | null> {
    const url = new URL(ODOO_URL);

    const commonClient = xmlrpc.createSecureClient({
        host: url.hostname,
        port: 443,
        path: '/xmlrpc/2/common',
    });

    return new Promise((resolve, reject) => {
        commonClient.methodCall(
            'authenticate',
            [ODOO_DB, username, password, {}],
            (error: any, uid: number) => {
                if (error) {
                    console.error('Odoo Authentication Error:', error);
                    reject(error);
                } else {
                    resolve(uid || null);
                }
            }
        );
    });
}

/**
 * Create an Odoo client instance from session data
 */
export function createOdooClient(uid: number, password: string): OdooClient {
    return new OdooClient({ uid, password });
}
