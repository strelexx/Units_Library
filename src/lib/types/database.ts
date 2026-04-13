export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      buildings: {
        Row: {
          city_id: string
          community_id: string
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["location_status"]
          sub_community_id: string
          total_floors: number | null
          updated_at: string
          year_built: number | null
        }
        Insert: {
          city_id: string
          community_id: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          sub_community_id: string
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          city_id?: string
          community_id?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          sub_community_id?: string
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buildings_sub_community_id_fkey"
            columns: ["sub_community_id"]
            isOneToOne: false
            referencedRelation: "sub_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["location_status"]
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          city_id: string
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["location_status"]
          updated_at: string
        }
        Insert: {
          city_id: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          metadata: Json | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      owners: {
        Row: {
          created_at: string
          emails: string[]
          id: string
          last_name: string | null
          name: string
          notes: string | null
          phone_numbers: string[]
          source: Database["public"]["Enums"]["lead_source"] | null
          source_details: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          emails?: string[]
          id?: string
          last_name?: string | null
          name: string
          notes?: string | null
          phone_numbers?: string[]
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_details?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          emails?: string[]
          id?: string
          last_name?: string | null
          name?: string
          notes?: string | null
          phone_numbers?: string[]
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_details?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sub_communities: {
        Row: {
          city_id: string
          community_id: string
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          name_ar: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["location_status"]
          updated_at: string
        }
        Insert: {
          city_id: string
          community_id: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          name_ar?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Update: {
          city_id?: string
          community_id?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          name_ar?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["location_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_communities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number | null
          bedrooms: Database["public"]["Enums"]["bedroom_count"] | null
          building_id: string
          created_at: string
          developer_id: string | null
          floor: number | null
          id: string
          levels: number | null
          living_area: number | null
          notes: string | null
          owner_id: string | null
          p_number: string | null
          plot_size: number | null
          ref_id: string | null
          status: Database["public"]["Enums"]["unit_status"]
          total_area: number | null
          type: Database["public"]["Enums"]["property_type"]
          unit_number: string
          updated_at: string
          value: number | null
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: Database["public"]["Enums"]["bedroom_count"] | null
          building_id: string
          created_at?: string
          developer_id?: string | null
          floor?: number | null
          id?: string
          levels?: number | null
          living_area?: number | null
          notes?: string | null
          owner_id?: string | null
          p_number?: string | null
          plot_size?: number | null
          ref_id?: string | null
          status?: Database["public"]["Enums"]["unit_status"]
          total_area?: number | null
          type: Database["public"]["Enums"]["property_type"]
          unit_number: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: Database["public"]["Enums"]["bedroom_count"] | null
          building_id?: string
          created_at?: string
          developer_id?: string | null
          floor?: number | null
          id?: string
          levels?: number | null
          living_area?: number | null
          notes?: string | null
          owner_id?: string | null
          p_number?: string | null
          plot_size?: number | null
          ref_id?: string | null
          status?: Database["public"]["Enums"]["unit_status"]
          total_area?: number | null
          type?: Database["public"]["Enums"]["property_type"]
          unit_number?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "building_locations"
            referencedColumns: ["building_id"]
          },
          {
            foreignKeyName: "units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          building_id: string | null
          city_id: string | null
          community_id: string | null
          created_at: string
          id: string
          sub_community_id: string | null
          user_id: string
        }
        Insert: {
          building_id?: string | null
          city_id?: string | null
          community_id?: string | null
          created_at?: string
          id?: string
          sub_community_id?: string | null
          user_id: string
        }
        Update: {
          building_id?: string | null
          city_id?: string | null
          community_id?: string | null
          created_at?: string
          id?: string
          sub_community_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "building_locations"
            referencedColumns: ["building_id"]
          },
          {
            foreignKeyName: "user_locations_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_sub_community_id_fkey"
            columns: ["sub_community_id"]
            isOneToOne: false
            referencedRelation: "sub_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          role: Database["public"]["Enums"]["user_role"]
          team: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          team?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          team?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      building_locations: {
        Row: {
          building_id: string | null
          city_id: string | null
          community_id: string | null
          sub_community_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_sub_community_id_fkey"
            columns: ["sub_community_id"]
            isOneToOne: false
            referencedRelation: "sub_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_communities_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accessible_building_ids: { Args: never; Returns: string[] }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      bedroom_count:
        | "studio"
        | "1"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
        | "9"
        | "10+"
      lead_source:
        | "direct"
        | "referral"
        | "website"
        | "social_media"
        | "cold_call"
        | "walk_in"
        | "event"
        | "other"
      location_status: "active" | "inactive"
      property_type:
        | "apartment"
        | "townhouse"
        | "villa"
        | "hotel_apartment"
        | "plot"
        | "shop"
        | "warehouse"
        | "farm"
      unit_status: "available" | "listed" | "private" | "archived"
      user_role: "admin" | "advisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      bedroom_count: [
        "studio",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10+",
      ],
      lead_source: [
        "direct",
        "referral",
        "website",
        "social_media",
        "cold_call",
        "walk_in",
        "event",
        "other",
      ],
      location_status: ["active", "inactive"],
      property_type: [
        "apartment",
        "townhouse",
        "villa",
        "hotel_apartment",
        "plot",
        "shop",
        "warehouse",
        "farm",
      ],
      unit_status: ["available", "listed", "private", "archived"],
      user_role: ["admin", "advisor"],
    },
  },
} as const

