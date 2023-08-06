import { MetaSetting } from './MetaSetting';
import { MediaConfig } from './MediaConfig';

export interface MetaData {
    ip_restriction: string;
    media_config: string;
    meta_player: string;
    meta_setting: string;
    meta_verse: string;
    model_3d: string;
    organizations: string;
    user: string;
}

export interface TokenModel {
    refresh: string;
    access: string;
}

export interface MetaVerse {
    id: number;
    name: string;
    model_3D: number;
    email: string;
    is_login: boolean;
    meta_type: any;
    domain: string;
    meta_setting: MetaSetting;
    media_config: MediaConfig;
    limit_access: any[];
}
